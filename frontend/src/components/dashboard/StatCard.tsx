import type { JSX } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  colorClass: string;
}

export function StatCard({
  label,
  value,
  colorClass,
}: StatCardProps): JSX.Element {
  return (
    <div className={`rounded-3xl p-5 text-white shadow-lg ${colorClass}`}>
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold">{label}</span>
      </div>
      <p className="text-xs text-white/80 mb-1">Nilai Saat Ini</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
