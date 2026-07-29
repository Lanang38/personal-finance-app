import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AccountForm } from "../components/accounts/AccountForm";
import { AccountList } from "../components/accounts/AccountList";
import { useAccounts } from "../context/AccountContext";
import { createAccountRequest, deleteAccountRequest } from "../api/accounts";
import { AccountType } from "../types";

export function AccountsPage(): JSX.Element {
  const { accounts, activeAccountId, setActiveAccountId, refreshAccounts, isLoading } =
    useAccounts();

  async function handleCreateAccount(payload: {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
  }): Promise<void> {
    await createAccountRequest(payload);
    await refreshAccounts();
  }

  async function handleDeleteAccount(id: string): Promise<void> {
    await deleteAccountRequest(id);
    await refreshAccounts();
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <AccountForm onSubmit={handleCreateAccount} />
        </div>
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-slate-400 text-sm">Memuat akun...</div>
          ) : (
            <AccountList
              accounts={accounts}
              activeAccountId={activeAccountId}
              onSelect={setActiveAccountId}
              onDelete={handleDeleteAccount}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
