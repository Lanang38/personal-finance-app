import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { DailyPoint } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import type { JSX } from 'react';

interface WalletChartProps {
  data: DailyPoint[];
  caption?: string;
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

export function WalletChart({ data, caption }: WalletChartProps): JSX.Element {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartData = data.map((point) => ({
    label: formatShortDate(point.date),
    Pemasukan: point.income,
    Pengeluaran: point.expense,
  }));

  const gridStroke = isDark ? '#363a45' : '#F1F5F9';
  const axisTickColor = isDark ? '#CBD5E1' : '#94A3B8';
  const tooltipBg = isDark ? '#272b34' : '#FFFFFF';
  const tooltipText = isDark ? '#F1F5F9' : '#1E293B';

  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Analitik Dompet
        </h2>
        <span className="text-xs text-brand-red font-semibold">Bulan Ini</span>
      </div>
      <p className="text-xs text-slate-400 mb-4">{caption ?? '\u00A0'}</p>

      {chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-slate-400 dark:text-slate-100 text-sm">
          Belum ada transaksi bulan ini
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={288}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6D28D9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridStroke}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: axisTickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: axisTickColor }}
              axisLine={false}
              tickLine={false}
            />
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
            <Area
              type="monotone"
              dataKey="Pengeluaran"
              stroke="#EF4444"
              strokeWidth={3}
              fill="url(#expenseFill)"
            />
            <Area
              type="monotone"
              dataKey="Pemasukan"
              stroke="#6D28D9"
              strokeWidth={3}
              fill="url(#incomeFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
