import { useState, useMemo } from 'react';
import {
  Trash2,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Budget } from '../../types';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(budgets.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedBudgets = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return budgets.slice(start, start + PAGE_SIZE);
  }, [budgets, safePage]);

  function startEdit(budget: Budget): void {
    setEditingId(budget.id);
    setEditValue(String(budget.limitAmount));
  }

  async function saveEdit(id: string): Promise<void> {
    const numericLimit = Number(editValue);
    if (!numericLimit || numericLimit <= 0) return;

    await onEdit(id, numericLimit);
    setEditingId(null);
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="font-bold text-lg text-slate-800 mb-4">Daftar Anggaran</h2>

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
                  : 'bg-brand-purple';

              return (
                <div
                  key={budget.id}
                  className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: budget.category.color }}
                      />

                      <span className="font-semibold text-slate-700 text-sm">
                        {budget.category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {editingId === budget.id ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-28 bg-slate-100 rounded-lg px-2 py-1 text-sm outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />

                          <button
                            type="button"
                            onClick={() => saveEdit(budget.id)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-brand-purple"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(budget)}
                            className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(budget.id)}
                            className="p-2 text-slate-400 hover:text-brand-red transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
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
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
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
