import { useState, useMemo } from 'react';
import { Trash2, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Account } from '../../types';
import type { JSX } from 'react';

interface AccountListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 3;

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function AccountList({
  accounts,
  onDelete,
}: AccountListProps): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedAccounts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return accounts.slice(start, start + PAGE_SIZE);
  }, [accounts, safePage]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
      <h2 className="font-bold text-lg text-slate-800 mb-4">Akun Saya</h2>

      {accounts.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">
          Belum ada akun
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedAccounts.map((account) => (
              <div
                key={account.id}
                className="w-full flex items-center gap-3 p-2 rounded-2xl bg-slate-50 text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Wallet size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{account.name}</p>
                  <p className="text-xs text-slate-400">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(account.id)}
                  className="p-2 text-slate-400 hover:text-brand-red transition-colors"
                  aria-label="Hapus akun"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple transition-colors"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              <span className="text-xs text-slate-400">
                Halaman {safePage} dari {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple transition-colors"
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
