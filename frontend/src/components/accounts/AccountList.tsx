import { useState, useMemo } from 'react';
import { Trash2, Wallet, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Account } from '../../types';
import type { JSX } from 'react';

interface AccountListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
  onAdd?: () => void;
}

const PAGE_SIZE = 3;

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function AccountList({
  accounts,
  onDelete,
  onAdd,
}: AccountListProps): JSX.Element {
  const [page, setPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const paginatedAccounts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return accounts.slice(start, start + PAGE_SIZE);
  }, [accounts, safePage]);

  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Akun Saya
        </h2>

        {/* + Button */}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label="Tambah akun"
            className="min-[1281px]:hidden w-8 h-8 rounded-full bg-brand-purple dark:bg-brand-blue text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* List */}
      {accounts.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-100 py-8 text-center">
          Belum ada akun
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedAccounts.map((account) => (
              <div
                key={account.id}
                className="w-full flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-dark-background text-slate-700 dark:text-slate-100"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-dark-background flex items-center justify-center shrink-0">
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
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-600">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
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
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
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
