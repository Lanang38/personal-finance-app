import { Trash2, Wallet } from "lucide-react";
import { Account } from "../../types";

interface AccountListProps {
  accounts: Account[];
  activeAccountId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function AccountList({
  accounts,
  activeAccountId,
  onSelect,
  onDelete,
}: AccountListProps): JSX.Element {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="font-bold text-lg text-slate-800 mb-4">Akun Saya</h2>

      {accounts.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">Belum ada akun</p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <button
              type="button"
              key={account.id}
              onClick={() => onSelect(account.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-colors ${
                activeAccountId === account.id
                  ? "bg-brand-purple text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activeAccountId === account.id ? "bg-white/20" : "bg-white"
                }`}
              >
                <Wallet size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{account.name}</p>
                <p
                  className={`text-xs ${
                    activeAccountId === account.id ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(account.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    onDelete(account.id);
                  }
                }}
                className={`p-2 rounded-full ${
                  activeAccountId === account.id ? "hover:bg-white/20" : "hover:bg-slate-200"
                }`}
                aria-label="Hapus akun"
              >
                <Trash2 size={16} />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
