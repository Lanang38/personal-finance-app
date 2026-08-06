import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AccountForm } from '../components/accounts/AccountForm';
import { AccountList } from '../components/accounts/AccountList';
import { AccountsSkeleton } from '../components/accounts/AccountsSkeleton';
import { AccountsDonut } from '../components/accounts/AccountsDonut';
import { WarningModal } from '../components/alert/Warning';
import { useAccounts } from '../context/AccountContext';
import { createAccountRequest, deleteAccountRequest } from '../api/accounts';
import { AccountType } from '../types';
import type { JSX } from 'react';

export function AccountsPage(): JSX.Element {
  const { accounts, refreshAccounts, isLoading } = useAccounts();
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Ketika halaman Accounts dibuka, tampilkan skeleton
  useEffect(() => {
    void refreshAccounts(true);
  }, [refreshAccounts]);

  async function handleCreateAccount(payload: {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
  }): Promise<void> {
    await createAccountRequest(payload);

    // Refresh tanpa delay (tidak menampilkan skeleton)
    await refreshAccounts(false);
  }

  async function handleDeleteAccount(id: string): Promise<void> {
    await deleteAccountRequest(id);

    // Refresh tanpa delay (tidak menampilkan skeleton)
    await refreshAccounts(false);
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <AccountForm
            onSubmit={handleCreateAccount}
            onError={setWarningMessage}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {isLoading ? (
            <AccountsSkeleton />
          ) : (
            <>
              <AccountList accounts={accounts} onDelete={handleDeleteAccount} />
              <AccountsDonut accounts={accounts} isLoading={isLoading} />
            </>
          )}
        </div>
      </div>

      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
