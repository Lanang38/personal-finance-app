import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Account } from '../types';
import { fetchAccounts } from '../api/accounts';
import { useAuth } from './AuthContext';
import { withMinimumDelay } from '../utils/withMinimumDelay';
import type { JSX } from 'react';

interface AccountContextValue {
  accounts: Account[];
  activeAccountId: string | null;
  setActiveAccountId: (id: string) => void;
  isLoading: boolean;
  refreshAccounts: (useDelay?: boolean) => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined,
);

export function AccountProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAccounts = useCallback(
    async (useDelay = false) => {
      if (!user) {
        setAccounts([]);
        setActiveAccountId(null);
        setIsLoading(false);
        return;
      }

      // Skeleton hanya jika diminta
      if (useDelay) {
        setIsLoading(true);
      }

      const list = useDelay
        ? await withMinimumDelay(fetchAccounts())
        : await fetchAccounts();

      setAccounts(list);

      setActiveAccountId((current) => {
        if (current && list.some((account) => account.id === current)) {
          return current;
        }

        return list[0]?.id ?? null;
      });

      if (useDelay) {
        setIsLoading(false);
      }
    },
    [user],
  );

  // Initial load aplikasi
  useEffect(() => {
    void refreshAccounts(true);
  }, [refreshAccounts]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        activeAccountId,
        setActiveAccountId,
        isLoading,
        refreshAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts(): AccountContextValue {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('useAccounts harus dipakai di dalam AccountProvider');
  }

  return context;
}
