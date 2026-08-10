import { useState, useMemo } from 'react';
import { Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Budget } from '../../types';
import { BudgetEditModal } from './BudgetEditModal';
import type { JSX } from 'react';

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (id: string, limitAmount: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const PAGE_SIZE = 4;

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function BudgetList({
  budgets,
  isLoading,
  onEdit,
  onDelete,
}: BudgetListProps): JSX.Element {
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(budgets.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedBudgets = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return budgets.slice(start, start + PAGE_SIZE);
  }, [budgets, safePage]);

  return (
    <>
      <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm">
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">
          Daftar Anggaran
        </h2>

        {isLoading ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            Memuat anggaran...
          </p>
        ) : budgets.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            Belum ada anggaran untuk bulan ini
          </p>
        ) : (
          <>
            <div className="space-y-5">
              {paginatedBudgets.map((budget) => {
                const isOver = budget.percentage >= 100;
                const isWarning = budget.percentage >= 80 && !isOver;

                const barColor = isOver
                  ? 'bg-brand-red'
                  : isWarning
                    ? 'bg-brand-orange'
                    : 'bg-brand-purple dark:bg-brand-blue';

                return (
                  <div
                    key={budget.id}
                    className="border-b border-slate-100 dark:border-slate-600 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-brand-purple dark:bg-brand-blue" />

                        <span className="font-semibold text-slate-700 dark:text-slate-100 text-sm">
                          {budget.category.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingBudget(budget)}
                          className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                          aria-label="Edit anggaran"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(budget.id)}
                          className="p-2 text-slate-400 hover:text-brand-red transition-colors"
                          aria-label="Hapus anggaran"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{
                          width: `${Math.min(budget.percentage, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {formatCurrency(budget.spent)} dari{' '}
                        {formatCurrency(budget.limitAmount)}
                      </span>

                      <span
                        className={
                          isOver
                            ? 'text-brand-red font-semibold'
                            : isWarning
                              ? 'text-brand-orange font-semibold'
                              : ''
                        }
                      >
                        {budget.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-600">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
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
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
                >
                  Selanjutnya
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {editingBudget && (
        <BudgetEditModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSave={async (id, limitAmount) => {
            await onEdit(id, limitAmount);
            setEditingBudget(null);
          }}
        />
      )}
    </>
  );
}
