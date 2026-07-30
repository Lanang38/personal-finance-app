import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Account } from "../types";
import { fetchAccounts } from "../api/accounts";
import { useAuth } from "./AuthContext";
import type { JSX } from 'react';

interface AccountContextValue {
  accounts: Account[];
  activeAccountId: string | null;
  setActiveAccountId: (id: string) => void;
  isLoading: boolean;
  refreshAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }): JSX.Element {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const list = await fetchAccounts();
    setAccounts(list);
    setActiveAccountId((current) => current ?? list[0]?.id ?? null);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    void refreshAccounts();
  }, [refreshAccounts]);

  const value: AccountContextValue = {
    accounts,
    activeAccountId,
    setActiveAccountId,
    isLoading,
    refreshAccounts,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccounts(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccounts harus dipakai di dalam AccountProvider");
  }
  return context;
}
