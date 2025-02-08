import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// User Types
export interface User {
  address: string;
  email?: string;
  protectedDataAddress?: string;
  isWeb3MailEnabled: boolean;
  createdAt: number;
  lastSeen: number;
  socialInfo?: Record<string, string | number | boolean>;
}

// Chat Types
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
  isWeb3Mail: boolean;
  protectedDataAddress?: string;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: {
    id: string;
    content: string;
    timestamp: number;
    senderId: string;
    recipientId: string;
  };
  unreadCount: Record<string, number>;
  createdAt: number;
  updatedAt: number;
  type: 'individual' | 'group';
  name?: string;
}

// AI Types
export interface AIMessage {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: number;
  chatId: string;
}

export interface AIChat {
  id: string;
  userId: string;
  threadId: string;
  title: string;
  lastMessage?: {
    content: string;
    timestamp: number;
  };
  createdAt: number;
  updatedAt: number;
}

// Trade Types
export interface TradeValues {
  takeProfit: string;
  stopLoss: string;
  lotSize: string;
}

export interface AIResponse {
  response: {
    kwargs: {
      content: string;
    };
  };
  threadId: string;
}

// Web3Mail Types
export interface Web3MailConfig {
  workerpoolAddress: string;
  senderName: string;
  contentType: 'text/plain' | 'text/html';
}

export type Address = `0x${string}`;
export type AddressOrEnsName = Address | string;

// Validation functions
export const isAddress = (value: string): value is Address => {
  return value.startsWith('0x') && value.length === 42;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Formatting functions
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp);
};

// Constants
export const IEXEC_EXPLORER_URL = 'https://explorer.iex.ec/bellecour/dataset/';
export const WEB3MAIL_APP_ENS = 'web3mail.apps.iexec.eth';
export const IEXEC_CHAIN_ID = '0x86'; // 134

export const DEFAULT_WEB3MAIL_CONFIG: Web3MailConfig = {
  workerpoolAddress: 'prod-v8-learn.main.pools.iexec.eth',
  senderName: 'Web3 Chat',
  contentType: 'text/plain'
};

// Chain Configuration
interface ChainParams {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const IEXEC_CHAIN_PARAMS: ChainParams = {
  chainId: IEXEC_CHAIN_ID,
  chainName: 'iExec Sidechain',
  nativeCurrency: {
    name: 'xRLC',
    symbol: 'xRLC',
    decimals: 18,
  },
  rpcUrls: ['https://bellecour.iex.ec'],
  blockExplorerUrls: ['https://blockscout-bellecour.iex.ec'],
};

// Wallet and Chain Connection
export function checkIsConnected() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask or use a Web3 browser.');
  }
  return window.ethereum;
}

export async function checkCurrentChain(): Promise<void> {
  const provider = checkIsConnected();
  
  try {
    if (!provider) {
      throw new Error('Provider not available');
    }

    const currentChainId = await provider.request<string>({
      method: 'eth_chainId',
      params: [],
    });

    if (currentChainId !== IEXEC_CHAIN_ID) {
      console.log('Switching to iExec chain...');
      
      await provider.request<null>({
        method: 'wallet_addEthereumChain',
        params: [IEXEC_CHAIN_PARAMS],
      });
      
      console.log('Switched to iExec chain');
    }
  } catch (err) {
    console.error('Failed to switch to iExec chain:', err);
    throw err;
  }
}

// URL and Link Helpers
export const getExplorerLink = (protectedDataAddress: string): string => {
  return `${IEXEC_EXPLORER_URL}${protectedDataAddress}`;
};