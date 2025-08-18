import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  connected: boolean;
  walletAddress?: string;
  email?: string;
  premium: boolean;
  hasPassword?: boolean;
  accountLocked?: boolean;
  pin?: string;
  password?: string;
}

interface Balance {
  bank: number;
  algo: number;
  usdc: number;
  stocks: number;
}

interface Transaction {
  id: string;
  type: 'payment' | 'recharge' | 'ticket' | 'trade' | 'convert';
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  date: string;
  time: string;
  fee?: number;
  reference: string;
  details?: any;
}

interface AppContextType {
  user: User;
  balance: Balance;
  transactions: Transaction[];
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  setUser: (user: User) => void;
  setBalance: (balance: Balance) => void;
  updateBalance: (type: 'debit' | 'credit', amount: number, source: 'bank' | 'algo' | 'usdc' | 'stocks') => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'time' | 'reference'>) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  saveUserCredentials: (email: string, password: string, pin: string) => void;
  validateCredentials: (email: string, password: string) => boolean;
  validatePin: (pin: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>({
    connected: false,
    premium: false,
    hasPassword: false,
    accountLocked: false,
  });

  const [balance, setBalanceState] = useState<Balance>({
    bank: 25430.50,
    algo: 1250.75,
    usdc: 5000.00,
    stocks: 12500.25,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'initial-1',
      type: 'payment',
      status: 'completed',
      amount: 250.00,
      currency: 'USD',
      description: 'Payment to John Doe',
      recipient: 'john.doe@email.com',
      date: '2024-01-15',
      time: '14:30',
      fee: 2.50,
      reference: 'PAY-2024-001'
    },
    {
      id: 'initial-2',
      type: 'recharge',
      status: 'completed',
      amount: 25.00,
      currency: 'USD',
      description: 'Mobile Recharge - Airtel',
      recipient: '+91 98765 43210',
      date: '2024-01-15',
      time: '12:15',
      fee: 0.50,
      reference: 'RCH-2024-002'
    },
    {
      id: 'initial-3',
      type: 'trade',
      status: 'completed',
      amount: 1000.00,
      currency: 'USD',
      description: 'Bought AAPL Stock',
      date: '2024-01-14',
      time: '09:45',
      fee: 5.00,
      reference: 'TRD-2024-003'
    },
    {
      id: 'initial-4',
      type: 'convert',
      status: 'completed',
      amount: 500.00,
      currency: 'USD',
      description: 'USD to ALGO Conversion',
      date: '2024-01-14',
      time: '16:20',
      fee: 2.00,
      reference: 'CNV-2024-004'
    }
  ]);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('algopayx_user');
    const savedBalance = localStorage.getItem('algopayx_balance');
    const savedTransactions = localStorage.getItem('algopayx_transactions');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUserState(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    
    if (savedBalance) {
      try {
        const balanceData = JSON.parse(savedBalance);
        setBalanceState(balanceData);
      } catch (error) {
        console.error('Error loading balance data:', error);
      }
    }

    if (savedTransactions) {
      try {
        const transactionData = JSON.parse(savedTransactions);
        setTransactions(transactionData);
      } catch (error) {
        console.error('Error loading transaction data:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('algopayx_user', JSON.stringify(newUser));
  };

  // Update balance and save to localStorage
  const setBalance = (newBalance: Balance) => {
    setBalanceState(newBalance);
    localStorage.setItem('algopayx_balance', JSON.stringify(newBalance));
  };

  // Update balance for transactions
  const updateBalance = (type: 'debit' | 'credit', amount: number, source: 'bank' | 'algo' | 'usdc' | 'stocks') => {
    setBalanceState(prev => {
      const newBalance = { ...prev };
      if (type === 'debit') {
        newBalance[source] = Math.max(0, newBalance[source] - amount);
      } else {
        newBalance[source] = newBalance[source] + amount;
      }
      localStorage.setItem('algopayx_balance', JSON.stringify(newBalance));
      return newBalance;
    });
  };

  // Add new transaction
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date' | 'time' | 'reference'>) => {
    const now = new Date();
    const newTransaction: Transaction = {
      ...transactionData,
      id: `txn-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      reference: `${transactionData.type.toUpperCase().slice(0, 3)}-${Date.now()}`
    };

    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      localStorage.setItem('algopayx_transactions', JSON.stringify(updated));
      return updated;
    });
  };

  // Save user credentials securely (in production, this would be encrypted)
  const saveUserCredentials = (email: string, password: string, pin: string) => {
    const credentials = {
      email,
      password: btoa(password), // Basic encoding (use proper encryption in production)
      pin: btoa(pin)
    };
    localStorage.setItem('algopayx_credentials', JSON.stringify(credentials));
  };

  // Validate user credentials
  const validateCredentials = (email: string, password: string): boolean => {
    const savedCredentials = localStorage.getItem('algopayx_credentials');
    if (!savedCredentials) return false;
    
    try {
      const credentials = JSON.parse(savedCredentials);
      return credentials.email === email && atob(credentials.password) === password;
    } catch {
      return false;
    }
  };

  // Validate PIN
  const validatePin = (pin: string): boolean => {
    const savedCredentials = localStorage.getItem('algopayx_credentials');
    if (!savedCredentials) return pin === '123456'; // Default PIN for demo
    
    try {
      const credentials = JSON.parse(savedCredentials);
      return atob(credentials.pin) === pin;
    } catch {
      return pin === '123456';
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <AppContext.Provider value={{
      user,
      balance,
      transactions,
      toast,
      setUser,
      setBalance,
      updateBalance,
      addTransaction,
      showToast,
      hideToast,
      saveUserCredentials,
      validateCredentials,
      validatePin,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}