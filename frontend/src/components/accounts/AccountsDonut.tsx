import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Account } from '../../types';
import type { JSX } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AccountsDonutProps {
  accounts: Account[];
  isLoading: boolean;
}

const ACCOUNT_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#F97316',
  '#EF4444',
  '#22C55E',
  '#EC4899',
  '#0EA5E9',
  '#A855F7',
];

export function AccountsDonut({
  accounts,
  isLoading,
}: AccountsDonutProps): JSX.Element {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const data = accounts.map((account, index) => ({
    id: account.id,
    name: account.name,
    balance: account.balance,
    color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
  }));
  const tooltipBg = isDark ? '#272b34' : '#FFFFFF';
  const tooltipText = isDark ? '#F1F5F9' : '#1E293B';

  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm flex flex-col">
      <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">
        Distribusi Saldo Akun
      </h2>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-10">
          Memuat akun...
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-10">
          Belum ada akun
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="balance"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`
              }
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: tooltipBg,
              }}
              itemStyle={{ color: tooltipText }}
              labelStyle={{ color: tooltipText }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
