// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useState, useCallback, useEffect, useRef } from 'react';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import Web3 from 'web3';
// import { useAuthStore, TradingLevel, AccountType } from '../stores/authStore';
// import db from '../../../firebase.config';

// interface UserInfo {
//   address: string;
//   email?: string;
//   tradingLevel?: TradingLevel;
//   accountType?: AccountType;
//   lastSeen?: number;
//   createdAt?: number;
//   isOnboardingComplete: boolean;
// }

// interface UseAuthReturn {
//   address: string | null;
//   isConnected: boolean;
//   isLoading: boolean;
//   error: string | null;
//   showModal: boolean;
//   userInfo: UserInfo | null;
//   web3: Web3 | null;
//   connectWallet: () => Promise<void>;
//   disconnectWallet: () => void;
//   setShowModal: (show: boolean) => void;
//   saveUserData: (data: Partial<UserInfo>) => Promise<void>;
//   checkUserExists: (address: string) => Promise<boolean>;
// }

// // Type guard for ethereum object
// const isEthereumAvailable = (): boolean => {
//   return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
// };

// export function useAuth(): UseAuthReturn {
//   const router = useRouter();
//   const [showModal, setShowModal] = useState(false);
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
//   const web3Ref = useRef<Web3 | null>(null);
//   const authStore = useAuthStore();
//   const initialCheckRef = useRef(false);

//   // Save user data to Firebase
//   const saveUserData = useCallback(async (data: Partial<UserInfo>) => {
//     if (!authStore.account) return;

//     try {
//       const timestamp = Date.now();
//       const userRef = doc(db, 'users', authStore.account.toLowerCase());
//       const userDoc = await getDoc(userRef);
      
//       const userData: UserInfo = {
//         address: authStore.account.toLowerCase(),
//         lastSeen: timestamp,
//         ...(userDoc.exists() ? userDoc.data() as Omit<UserInfo, 'address'> : { createdAt: timestamp }),
//         ...data,
//         isOnboardingComplete: data.isOnboardingComplete ?? false
//       };

//       await setDoc(userRef, userData, { merge: true });
      
//       // Update auth store with new user data
//       authStore.setUserData({
//         address: userData.address,
//         email: userData.email,
//         tradingLevel: userData.tradingLevel || null,
//         accountType: userData.accountType || null,
//         isOnboardingComplete: userData.isOnboardingComplete,
//         lastSeen: userData.lastSeen,
//         createdAt: userData.createdAt
//       });

//       // Only update userInfo if the component is still mounted
//       setUserInfo(userData);

//     } catch (error) {
//       console.error('Failed to save user data:', error);
//       throw error;
//     }
//   }, [authStore]);

//   // Check if user exists in Firebase
//   const checkUserExists = useCallback(async (address: string): Promise<boolean> => {
//     try {
//       const userDoc = await getDoc(doc(db, 'users', address.toLowerCase()));
//       const exists = userDoc.exists();
//       if (exists) {
//         const userData = userDoc.data() as UserInfo;
//         // Update the auth store instead of local state
//         authStore.setUserData({
//           address: userData.address,
//           email: userData.email,
//           tradingLevel: userData.tradingLevel || null,
//           accountType: userData.accountType || null,
//           isOnboardingComplete: userData.isOnboardingComplete,
//           lastSeen: userData.lastSeen,
//           createdAt: userData.createdAt
//         });
//       }
//       return exists;
//     } catch (error) {
//       console.error('Error checking user existence:', error);
//       return false;
//     }
//   }, [authStore]);

//   const connectWallet = useCallback(async () => {
//     try {
//       authStore.setLoading(true);
//       authStore.setError(null);

//       if (!isEthereumAvailable()) {
//         throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
//       }

//       if (!web3Ref.current) {
//         web3Ref.current = new Web3(window.ethereum!);
//       }

//       let accounts: string[];
//       try {
//         accounts = await window.ethereum!.request<string[]>({
//           method: 'eth_requestAccounts'
//         });
//       } catch (error: any) {
//         let errorMessage = 'Failed to connect wallet';
        
//         if (error?.code === 4001) {
//           errorMessage = 'Please connect your wallet. Request was rejected.';
//         } else if (error?.code === -32002) {
//           errorMessage = 'Please unlock MetaMask and try again.';
//         }
        
//         throw new Error(errorMessage);
//       }

//       if (!accounts || accounts.length === 0) {
//         throw new Error('No accounts found. Please check your MetaMask configuration.');
//       }

//       const userAddress = accounts[0];
      
//       const exists = await checkUserExists(userAddress);
//       const userDoc = exists ? await getDoc(doc(db, 'users', userAddress.toLowerCase())) : null;
//       const userData = userDoc?.data() as UserInfo | undefined;
      
//       authStore.setAccount(userAddress);
//       authStore.setConnected(true);
//       authStore.setWeb3(web3Ref.current);
      
//       if (exists && userData?.isOnboardingComplete) {
//         await saveUserData({
//           lastSeen: Date.now(),
//           isOnboardingComplete: true,
//           tradingLevel: userData.tradingLevel,
//           accountType: userData.accountType
//         });
//         router.push('/chats');
//       } else {
//         authStore.setUserData({
//           address: userAddress,
//           isOnboardingComplete: false,
//           tradingLevel: null,
//           accountType: null
//         });
//         router.push('/');
//       }

//       setShowModal(false);

//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
//       authStore.setError(errorMessage);
//       throw error;
//     } finally {
//       authStore.setLoading(false);
//     }
//   }, [authStore, checkUserExists, saveUserData, router]);

//   const disconnectWallet = useCallback(() => {
//     authStore.reset();
//     setUserInfo(null);
//     web3Ref.current = null;
//     router.push('/');
//   }, [authStore, router]);

//   // Handle wallet events
//   useEffect(() => {
//     if (!isEthereumAvailable()) return;

//     const ethereum = window.ethereum!;

//     const handleAccountsChanged = async (accounts: string[]) => {
//       if (accounts.length === 0) {
//         disconnectWallet();
//       } else if (accounts[0] !== authStore.account) {
//         const exists = await checkUserExists(accounts[0]);
//         if (exists) {
//           await saveUserData({ lastSeen: Date.now() });
//         }
//         authStore.setAccount(accounts[0]);
//       }
//     };

//     const handleChainChanged = () => {
//       window.location.reload();
//     };

//     const handleDisconnect = () => {
//       disconnectWallet();
//     };

//     ethereum.on('accountsChanged', handleAccountsChanged);
//     ethereum.on('chainChanged', handleChainChanged);
//     ethereum.on('disconnect', handleDisconnect);

//     // Check initial connection only once
//     if (!initialCheckRef.current) {
//       initialCheckRef.current = true;
//       ethereum.request<string[]>({ method: 'eth_accounts' })
//         .then(accounts => {
//           if (accounts && accounts.length > 0) {
//             handleAccountsChanged(accounts);
//           }
//         })
//         .catch((error: any) => {
//           console.error('Error checking initial accounts:', error);
//         });
//     }

//     return () => {
//       ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       ethereum.removeListener('chainChanged', handleChainChanged);
//       ethereum.removeListener('disconnect', handleDisconnect);
//     };
//   }, [authStore, disconnectWallet, checkUserExists, saveUserData]);

//   // Sync userInfo with authStore
//   useEffect(() => {
//     if (authStore.account && !userInfo) {
//       checkUserExists(authStore.account)
//         .then(exists => {
//           if (exists) {
//             getDoc(doc(db, 'users', authStore.account!.toLowerCase()))
//               .then(userDoc => {
//                 if (userDoc.exists()) {
//                   setUserInfo(userDoc.data() as UserInfo);
//                 }
//               });
//           }
//         });
//     }
//   }, [authStore.account, userInfo, checkUserExists]);

//   return {
//     address: authStore.account,
//     isConnected: authStore.isConnected,
//     isLoading: authStore.isLoading,
//     error: authStore.error,
//     showModal,
//     userInfo,
//     web3: web3Ref.current,
//     connectWallet,
//     disconnectWallet,
//     setShowModal,
//     saveUserData,
//     checkUserExists,
//   };
// }

// export default useAuth;