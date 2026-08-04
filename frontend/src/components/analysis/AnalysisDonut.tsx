import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Account, CategoryBreakdownPoint } from '../../types';
import type { JSX } from 'react';

type DonutView = 'expense' | 'income' | 'accounts';

interface InsightDonutProps {
  expenseByCategory: CategoryBreakdownPoint[];
  incomeByCategory: CategoryBreakdownPoint[];
  accounts: Account[];
  isAccountsLoading: boolean;
  captions?: Partial<Record<DonutView, string | undefined>>;
}

interface DonutSlice {
  id: string;
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  '#7C3AED',
  '#2563EB',
  '#F97316',
  '#EF4444',
  '#22C55E',
  '#EC4899',
  '#0EA5E9',
  '#A855F7',
];

const VIEW_OPTIONS: { value: DonutView; label: string }[] = [
  { value: 'expense', label: 'Pengeluaran' },
  { value: 'income', label: 'Pemasukan' },
  { value: 'accounts', label: 'Akun' },
];

const EMPTY_LABEL: Record<DonutView, string> = {
  expense: 'Belum ada data pengeluaran',
  income: 'Belum ada data pemasukan',
  accounts: 'Belum ada akun',
};

export function AnalysisDonut({
  expenseByCategory,
  incomeByCategory,
  accounts,
  isAccountsLoading,
  captions,
}: InsightDonutProps): JSX.Element {
  const [view, setView] = useState<DonutView>('expense');

  const data: DonutSlice[] = useMemo(() => {
    if (view === 'expense') {
      return expenseByCategory.map((c, index) => ({
        id: c.categoryId,
        name: c.categoryName,
        value: c.total,
        color: COLORS[index % COLORS.length],
      }));
    }
    if (view === 'income') {
      return incomeByCategory.map((c, index) => ({
        id: c.categoryId,
        name: c.categoryName,
        value: c.total,
        color: COLORS[index % COLORS.length],
      }));
    }
    return accounts.map((account, index) => ({
      id: account.id,
      name: account.name,
      value: account.balance,
      color: COLORS[index % COLORS.length],
    }));
  }, [view, expenseByCategory, incomeByCategory, accounts]);

  const isLoading = view === 'accounts' && isAccountsLoading;
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const caption = captions?.[view];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-1 gap-2">
        <h2 className="font-bold text-lg text-slate-800">Rincian</h2>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as DonutView)}
          className="bg-slate-100 text-sm font-semibold text-slate-600 rounded-xl px-3 py-1.5 outline-none hover:outline-none hover:ring-2 hover:ring-brand-purple/40"
        >
          {VIEW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-slate-400 mb-3">{caption ?? '\u00A0'}</p>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Memuat...
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          {EMPTY_LABEL[view]}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const numericValue = Number(value ?? 0);
                const percentage =
                  total > 0 ? Math.round((numericValue / total) * 100) : 0;
                return [
                  `Rp ${numericValue.toLocaleString('id-ID')} (${percentage}%)`,
                  name,
                ];
              }}
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
