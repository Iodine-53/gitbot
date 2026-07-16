import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account } from '../types';
import { api } from '../lib/api';

interface AppContextType {
  activeAccount: Account | null;
  setActiveAccount: (account: Account) => void;
  accounts: Account[];
  loadingAccounts: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getAccounts().then((data) => {
      if (!mounted) return;
      setAccounts(data);
      if (data.length > 0 && !activeAccount) {
        setActiveAccount(data[0]);
      }
      setLoadingAccounts(false);
    });
    return () => {
      mounted = false;
    };
  }, [activeAccount]);

  return (
    <AppContext.Provider value={{ activeAccount, setActiveAccount, accounts, loadingAccounts }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
