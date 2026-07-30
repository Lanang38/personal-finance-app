import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryBreakdownPoint } from "../../types";
import type { JSX } from 'react';

interface CategoryDonutProps {
  data: CategoryBreakdownPoint[];
}

export function CategoryDonut({ data }: CategoryDonutProps): JSX.Element {
  const total = data.reduce((sum, point) => sum + point.total, 0);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <h2 className="font-bold text-lg text-slate-800 mb-4">Kategori Pengeluaran</h2>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Belum ada data pengeluaran
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoryName"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.categoryId} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {data.map((entry) => (
              <div key={entry.categoryId} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 truncate">{entry.categoryName}</span>
                <span className="ml-auto font-semibold text-slate-800">
                  {total > 0 ? Math.round((entry.total / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
