import { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { BudgetForm } from '../components/budgets/BudgetForm';
import { BudgetList } from '../components/budgets/BudgetList';
import { BudgetSkeleton } from '../components/budgets/BudgetSkeleton';
import { fetchCategories } from '../api/categories';
import { withMinimumDelay } from '../utils/withMinimumDelay';
import {
  fetchAvailableMonths,
  fetchBudgets,
  createBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest,
} from '../api/budgets';
import { Category, Budget } from '../types';
import type { JSX } from 'react';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(value: string): string {
  const [year, month] = value.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

export function BudgetsPage(): JSX.Element {
  const [month, setMonth] = useState(currentMonth());
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const months = await fetchAvailableMonths();

      setAvailableMonths(months);

      if (months.length > 0 && !months.includes(month)) {
        setMonth(months[0]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Loading awal (pakai skeleton)
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);

    const [categoryList, budgetResponse] = await withMinimumDelay(
      Promise.all([fetchCategories(), fetchBudgets(month)]),
    );

    setCategories(categoryList);
    setBudgets(budgetResponse.budgets);

    setIsLoading(false);
  }, [month]);

  /**
   * Refresh data (tanpa skeleton)
   */
  const refreshData = useCallback(async () => {
    const [categoryList, budgetResponse] = await Promise.all([
      fetchCategories(),
      fetchBudgets(month),
    ]);

    setCategories(categoryList);
    setBudgets(budgetResponse.budgets);
  }, [month]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const expenseCategories = categories.filter(
    (category) => category.kind === 'expense',
  );

  const budgetedCategoryIds = new Set(
    budgets.map((budget) => budget.category.id),
  );

  const availableCategories = expenseCategories.filter(
    (category) => !budgetedCategoryIds.has(category.id),
  );

  async function handleCreate(payload: {
    categoryId: string;
    limitAmount: number;
  }): Promise<void> {
    await createBudgetRequest({
      ...payload,
      month,
    });

    await refreshData();
  }

  async function handleEdit(id: string, limitAmount: number): Promise<void> {
    await updateBudgetRequest(id, limitAmount);

    await refreshData();
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteBudgetRequest(id);

    await refreshData();
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-lg text-slate-800">Anggaran</h2>

              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  disabled={availableMonths.length === 0}
                  className="appearance-none bg-slate-100 rounded-xl pl-4 pr-9 py-2 text-sm font-semibold text-slate-700 outline-none disabled:opacity-60"
                >
                  {availableMonths.length === 0 ? (
                    <option value={month}>{formatMonthLabel(month)}</option>
                  ) : (
                    availableMonths.map((item) => (
                      <option key={item} value={item}>
                        {formatMonthLabel(item)}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <BudgetForm
            availableCategories={availableCategories}
            isReady={!isLoading}
            onSubmit={handleCreate}
          />
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <BudgetSkeleton />
          ) : (
            <BudgetList
              budgets={budgets}
              isLoading={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
