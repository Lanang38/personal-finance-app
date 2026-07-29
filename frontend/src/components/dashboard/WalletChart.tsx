import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DailyPoint } from "../../types";

interface WalletChartProps {
  data: DailyPoint[];
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

export function WalletChart({ data }: WalletChartProps): JSX.Element {
  const chartData = data.map((point) => ({
    label: formatShortDate(point.date),
    Pemasukan: point.income,
    Pengeluaran: point.expense,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-slate-800">Analitik Dompet</h2>
        <span className="text-xs text-brand-red font-semibold">Bulan Ini</span>
      </div>

      {chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
          Belum ada transaksi bulan ini
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={288}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
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
