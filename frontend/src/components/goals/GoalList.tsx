import { useState, useMemo, useEffect } from 'react';
import {
  Trash2,
  PlusCircle,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Account, Goal } from '../../types';
import { ContributeGoalModal } from './ContributeGoalModal';
import type { JSX } from 'react';

interface GoalListProps {
  goals: Goal[];
  accounts: Account[];
  isLoading: boolean;
  onContribute: (
    id: string,
    amount: number,
    accountId: string,
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const PAGE_SIZE = 2;

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function daysRemaining(value: string): number {
  const target = new Date(value);
  const now = new Date();

  const diffMs = target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function GoalList({
  goals,
  accounts,
  isLoading,
  onContribute,
  onDelete,
}: GoalListProps): JSX.Element {
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);

  const [page, setPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(goals.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedGoals = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return goals.slice(start, start + PAGE_SIZE);
  }, [goals, safePage]);

  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm">
      <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">
        Daftar Target Tabungan
      </h2>

      {isLoading ? (
        <p className="text-sm text-slate-400 dark:text-slate-100 py-8 text-center">
          Memuat target tabungan...
        </p>
      ) : goals.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-100 py-8 text-center">
          Belum ada target tabungan
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedGoals.map((goal) => {
              const remaining = Math.max(
                goal.targetAmount - goal.currentAmount,
                0,
              );

              const overdue =
                !goal.isCompleted &&
                goal.targetDate &&
                daysRemaining(goal.targetDate) < 0;

              return (
                <div
                  key={goal.id}
                  className="border-b border-slate-100 dark:border-slate-600 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-slate-700 dark:text-slate-100 text-sm truncate">
                        {goal.name}
                      </span>

                      {goal.isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-purple dark:text-brand-blue bg-brand-purple/10 px-2 py-0.5 rounded-full shrink-0">
                          <PartyPopper size={11} />
                          Tercapai
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(goal.id)}
                      className="p-2 text-slate-400 hover:text-brand-red transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full ${
                        goal.isCompleted ? 'bg-brand-purple' : 'bg-brand-blue'
                      }`}
                      style={{
                        width: `${Math.min(goal.percentage, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>
                      {formatCurrency(goal.currentAmount)} dari{' '}
                      {formatCurrency(goal.targetAmount)}
                    </span>

                    <span className="font-semibold text-slate-600">
                      {goal.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>
                      {goal.isCompleted
                        ? 'Target sudah tercapai 🎉'
                        : `Sisa ${formatCurrency(remaining)}`}
                    </span>

                    {goal.targetDate && (
                      <span
                        className={
                          overdue ? 'text-brand-red font-semibold' : ''
                        }
                      >
                        {overdue ? 'Sudah melewati ' : 'Target: '}
                        {formatDate(goal.targetDate)}
                      </span>
                    )}
                  </div>

                  {!goal.isCompleted && (
                    <button
                      type="button"
                      onClick={() => setContributingGoal(goal)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-brand-purple/80 dark:text-brand-blue dark:hover:text-brand-blue/80 transition-colors"
                    >
                      <PlusCircle size={14} />
                      Tambah Kontribusi
                    </button>
                  )}
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
                className="flex items-center gap-1 text-sm font-semibold text-slate-500dark:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {contributingGoal && (
        <ContributeGoalModal
          goal={contributingGoal}
          accounts={accounts}
          onClose={() => setContributingGoal(null)}
          onSubmit={onContribute}
        />
      )}
    </div>
  );
}
