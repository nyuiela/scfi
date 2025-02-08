'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Web3 from 'web3';

export type TradingLevel = 'beginner' | 'intermediate' | 'pro' | null;
export type AccountType = 'standard' | 'admin' | null;

interface UserData {
  address: string | null;
  email?: string;
  tradingLevel: TradingLevel;
  accountType: AccountType;
  isOnboardingComplete: boolean;
  lastSeen?: number;
  createdAt?: number;
}

interface AuthState {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  userData: UserData | null;
  isInitialized: boolean;
}

interface AuthActions {
  setWeb3: (web3: Web3 | null) => void;
  setAccount: (account: string | null) => void;
  setConnected: (isConnected: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setUserData: (userData: Partial<UserData>) => void;
  updateOnboardingStatus: (isComplete: boolean) => void;
  setTradingLevel: (level: TradingLevel) => void;
  setAccountType: (type: AccountType) => void;
  reset: () => void;
  initialize: () => void;
  // New batch update action
  batchUpdateUserData: (updates: Partial<UserData>) => void;
}

const initialState: AuthState = {
  web3: null,
  account: null,
  isConnected: false,
  isLoading: false,
  error: null,
  userData: null,
  isInitialized: false,
};

const createInitialUserData = (partialData: Partial<UserData>): UserData => ({
  address: null,
  tradingLevel: null,
  accountType: null,
  isOnboardingComplete: false,
  ...partialData
});

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setWeb3: (web3) => set({ web3 }),
      
      setAccount: (account) => {
        const currentState = get();
        if (currentState.account !== account) {
          set({ account });
        }
      },
      
      setConnected: (isConnected) => {
        const currentState = get();
        if (currentState.isConnected !== isConnected) {
          set({ isConnected });
          // Reset user data if disconnecting
          if (!isConnected) {
            set({ userData: null });
          }
        }
      },
      
      setLoading: (isLoading) => {
        const currentState = get();
        if (currentState.isLoading !== isLoading) {
          set({ isLoading });
        }
      },
      
      setError: (error) => {
        const currentState = get();
        if (currentState.error !== error) {
          set({ error });
        }
      },
      
      // Optimized setUserData to prevent unnecessary updates
      setUserData: (newUserData) => set((state) => {
        if (!state.userData && !newUserData.address) return state;
        
        const updatedUserData = state.userData
          ? { ...state.userData, ...newUserData }
          : createInitialUserData(newUserData);
        
        // Check if there are actual changes
        if (JSON.stringify(state.userData) === JSON.stringify(updatedUserData)) {
          return state;
        }
        
        return { userData: updatedUserData };
      }),

      // New batch update function to handle multiple updates at once
      batchUpdateUserData: (updates) => set((state) => {
        const updatedUserData = state.userData
          ? { ...state.userData, ...updates }
          : createInitialUserData(updates);
        
        return { userData: updatedUserData };
      }),

      updateOnboardingStatus: (isComplete) => set((state) => {
        if (!state.userData) return state;
        if (state.userData.isOnboardingComplete === isComplete) return state;
        
        return {
          userData: {
            ...state.userData,
            isOnboardingComplete: isComplete
          }
        };
      }),

      setTradingLevel: (level) => set((state) => {
        if (!state.userData) return state;
        if (state.userData.tradingLevel === level) return state;
        
        return {
          userData: {
            ...state.userData,
            tradingLevel: level
          }
        };
      }),

      setAccountType: (type) => set((state) => {
        if (!state.userData) return state;
        if (state.userData.accountType === type) return state;
        
        return {
          userData: {
            ...state.userData,
            accountType: type
          }
        };
      }),
      
      reset: () => set({
        ...initialState,
        isInitialized: true
      }),

      initialize: () => set((state) => {
        if (state.isInitialized) return state;
        return { isInitialized: true };
      }),
    }),
    {
      name: 'web3-auth-storage',
      partialize: (state) => ({
        account: state.account,
        isConnected: state.isConnected,
        userData: state.userData,
      }),
    }
  )
);

// Type-safe selector hooks with memoization
export const useIsConnected = () => useAuthStore((state) => state.isConnected);
export const useAccount = () => useAuthStore((state) => state.account);
export const useWeb3 = () => useAuthStore((state) => state.web3);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useUserData = () => useAuthStore((state) => state.userData);
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized);

// New utility function for batched updates
export const useBatchedUpdates = () => useAuthStore((state) => state.batchUpdateUserData);

export default useAuthStore;