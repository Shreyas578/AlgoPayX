import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  WalletType, 
  AlgorandAccount, 
  connectWallet, 
  disconnectWallet, 
  getAccountInfo,
  sendAlgoTransaction,
  sendAssetTransaction,
  getTransactionHistory,
  optInToAsset,
  swapAssets,
  COMMON_ASSETS,
  getAssetPrice
} from '../services/algorand';

interface AlgorandContextType {
  // Connection state
  isConnected: boolean;
  accounts: AlgorandAccount[];
  activeAccount: AlgorandAccount | null;
  walletType: WalletType | null;
  
  // Account data
  accountInfo: any;
  balance: number;
  assets: any[];
  
  // Loading states
  isConnecting: boolean;
  isLoading: boolean;
  
  // Functions
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  setActiveAccount: (account: AlgorandAccount) => void;
  refreshAccountInfo: () => Promise<void>;
  sendPayment: (receiver: string, amount: number, note?: string) => Promise<string>;
  sendAsset: (receiver: string, assetId: number, amount: number, note?: string) => Promise<string>;
  optIn: (assetId: number) => Promise<string>;
  swap: (fromAssetId: number, toAssetId: number, amount: number) => Promise<string>;
  getHistory: () => Promise<any[]>;
}

const AlgorandContext = createContext<AlgorandContextType | undefined>(undefined);

export function AlgorandProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState<AlgorandAccount[]>([]);
  const [activeAccount, setActiveAccountState] = useState<AlgorandAccount | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [assets, setAssets] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved connection state
  useEffect(() => {
    const savedConnection = localStorage.getItem('algorand_connection');
    if (savedConnection) {
      try {
        const { walletType: savedWalletType, accounts: savedAccounts, activeAccount: savedActiveAccount } = JSON.parse(savedConnection);
        setWalletType(savedWalletType);
        setAccounts(savedAccounts);
        setActiveAccountState(savedActiveAccount);
        setIsConnected(true);
        
        // Refresh account info
        if (savedActiveAccount) {
          refreshAccountInfo(savedActiveAccount.address);
        }
      } catch (error) {
        console.error('Error loading saved connection:', error);
        localStorage.removeItem('algorand_connection');
      }
    }
  }, []);

  const connect = async (selectedWalletType: WalletType) => {
    setIsConnecting(true);
    try {
      const connectedAccounts = await connectWallet(selectedWalletType);
      
      setAccounts(connectedAccounts);
      setActiveAccountState(connectedAccounts[0]);
      setWalletType(selectedWalletType);
      setIsConnected(true);
      
      // Save connection state
      const connectionState = {
        walletType: selectedWalletType,
        accounts: connectedAccounts,
        activeAccount: connectedAccounts[0]
      };
      localStorage.setItem('algorand_connection', JSON.stringify(connectionState));
      
      // Load account info
      await refreshAccountInfo(connectedAccounts[0].address);
      
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (walletType) {
        await disconnectWallet(walletType);
      }
      
      setIsConnected(false);
      setAccounts([]);
      setActiveAccountState(null);
      setWalletType(null);
      setAccountInfo(null);
      setBalance(0);
      setAssets([]);
      
      // Clear saved connection
      localStorage.removeItem('algorand_connection');
      
    } catch (error) {
      console.error('Disconnection failed:', error);
      throw error;
    }
  };

  const setActiveAccount = (account: AlgorandAccount) => {
    setActiveAccountState(account);
    refreshAccountInfo(account.address);
    
    // Update saved connection
    const savedConnection = localStorage.getItem('algorand_connection');
    if (savedConnection) {
      const connectionState = JSON.parse(savedConnection);
      connectionState.activeAccount = account;
      localStorage.setItem('algorand_connection', JSON.stringify(connectionState));
    }
  };

  const refreshAccountInfo = async (address?: string) => {
    const targetAddress = address || activeAccount?.address;
    if (!targetAddress) return;
    
    setIsLoading(true);
    try {
      const info = await getAccountInfo(targetAddress);
      setAccountInfo(info);
      setBalance(info.balance);
      setAssets(info.assets);
    } catch (error) {
      console.error('Error refreshing account info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPayment = async (receiver: string, amount: number, note?: string): Promise<string> => {
    if (!activeAccount || !walletType) {
      throw new Error('No active account or wallet connected');
    }
    
    const txId = await sendAlgoTransaction(
      activeAccount.address,
      receiver,
      amount,
      note || '',
      walletType
    );
    
    // Refresh account info after transaction
    await refreshAccountInfo();
    
    return txId;
  };

  const sendAsset = async (receiver: string, assetId: number, amount: number, note?: string): Promise<string> => {
    if (!activeAccount || !walletType) {
      throw new Error('No active account or wallet connected');
    }
    
    const txId = await sendAssetTransaction(
      activeAccount.address,
      receiver,
      assetId,
      amount,
      note || '',
      walletType
    );
    
    // Refresh account info after transaction
    await refreshAccountInfo();
    
    return txId;
  };

  const optIn = async (assetId: number): Promise<string> => {
    if (!activeAccount || !walletType) {
      throw new Error('No active account or wallet connected');
    }
    
    const txId = await optInToAsset(activeAccount.address, assetId, walletType);
    
    // Refresh account info after opt-in
    await refreshAccountInfo();
    
    return txId;
  };

  const swap = async (fromAssetId: number, toAssetId: number, amount: number): Promise<string> => {
    if (!activeAccount || !walletType) {
      throw new Error('No active account or wallet connected');
    }
    
    const txId = await swapAssets(activeAccount.address, fromAssetId, toAssetId, amount, walletType);
    
    // Refresh account info after swap
    await refreshAccountInfo();
    
    return txId;
  };

  const getHistory = async (): Promise<any[]> => {
    if (!activeAccount) {
      throw new Error('No active account');
    }
    
    return await getTransactionHistory(activeAccount.address);
  };

  return (
    <AlgorandContext.Provider value={{
      isConnected,
      accounts,
      activeAccount,
      walletType,
      accountInfo,
      balance,
      assets,
      isConnecting,
      isLoading,
      connect,
      disconnect,
      setActiveAccount,
      refreshAccountInfo,
      sendPayment,
      sendAsset,
      optIn,
      swap,
      getHistory
    }}>
      {children}
    </AlgorandContext.Provider>
  );
}

export function useAlgorand() {
  const context = useContext(AlgorandContext);
  if (context === undefined) {
    throw new Error('useAlgorand must be used within an AlgorandProvider');
  }
  return context;
}