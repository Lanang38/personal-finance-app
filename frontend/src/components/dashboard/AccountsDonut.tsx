import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Account } from '../../types';
import type { JSX } from 'react';

interface AccountsDonutProps {
  accounts: Account[];
  isLoading: boolean;
  caption?: string;
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
  caption,
}: AccountsDonutProps): JSX.Element {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  const data = accounts.map((account, index) => ({
    id: account.id,
    name: account.name,
    balance: account.balance,
    color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
      <h2 className="font-bold text-lg text-slate-800">
        Distribusi Saldo Akun
      </h2>
      <p className="text-xs text-slate-400 mb-3">{caption ?? '\u00A0'}</p>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Memuat akun...
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Belum ada akun
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="balance"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
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
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {data.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 truncate">{entry.name}</span>
                <span className="ml-auto font-semibold text-slate-800">
                  {total > 0 ? Math.round((entry.balance / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
