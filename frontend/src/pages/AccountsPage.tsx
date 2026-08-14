import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AccountForm } from '../components/accounts/AccountForm';
import { AccountFormModal } from '../components/accounts/AccountFormModal';
import { AccountList } from '../components/accounts/AccountList';
import { AccountsSkeleton } from '../components/accounts/AccountsSkeleton';
import { AccountsDonut } from '../components/accounts/AccountsDonut';
import { Warning } from '../components/alert/Warning';
import { useAccounts } from '../context/AccountContext';
import { createAccountRequest, deleteAccountRequest } from '../api/accounts';
import { AccountType } from '../types';
import type { JSX } from 'react';

export function AccountsPage(): JSX.Element {
  const { accounts, refreshAccounts, isLoading } = useAccounts();

  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);

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

    await refreshAccounts(false);
  }

  async function handleDeleteAccount(id: string): Promise<void> {
    await deleteAccountRequest(id);

    await refreshAccounts(false);
  }

  function openFormModal(): void {
    setIsFormModalOpen(true);
  }

  function closeFormModal(): void {
    setIsFormModalOpen(false);
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 min-[1281px]:grid-cols-3 gap-6">
        {/* Account Form */}
        <div className="hidden min-[1281px]:block">
          <AccountForm
            onSubmit={handleCreateAccount}
            onError={setWarningMessage}
          />
        </div>

        {/* Account List */}
        <div className="min-[1281px]:col-span-2 flex flex-col gap-6">
          {isLoading ? (
            <AccountsSkeleton />
          ) : (
            <>
              <AccountList
                accounts={accounts}
                onDelete={handleDeleteAccount}
                onAdd={openFormModal}
              />

              <AccountsDonut accounts={accounts} isLoading={isLoading} />
            </>
          )}
        </div>
      </div>

      {/* Account Form Popup */}
      {isFormModalOpen && (
        <AccountFormModal
          onSubmit={handleCreateAccount}
          onError={setWarningMessage}
          onClose={closeFormModal}
        />
      )}

      {warningMessage && (
        <Warning
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
