import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { JSX } from 'react';

interface MonthYearFilterProps {
  activeMonth: number | null;
  activeYear: number | null;
  onApply: (month: number, year: number) => void;
  onReset: () => void;
}

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

function buildYearOptions(centerYear: number): number[] {
  const years: number[] = [];
  for (let y = centerYear - 4; y <= centerYear + 1; y += 1) {
    years.push(y);
  }
  return years;
}

export function MonthYearFilter({
  activeMonth,
  activeYear,
  onApply,
  onReset,
}: MonthYearFilterProps): JSX.Element {
  const now = new Date();
  const [pendingMonth, setPendingMonth] = useState<number>(
    activeMonth ?? now.getMonth() + 1,
  );
  const [pendingYear, setPendingYear] = useState<number>(
    activeYear ?? now.getFullYear(),
  );
  const yearOptions = buildYearOptions(now.getFullYear());
  const isFilterActive = activeMonth !== null && activeYear !== null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={pendingMonth}
        onChange={(e) => setPendingMonth(Number(e.target.value))}
        className="bg-white border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-purple/40"
      >
        {MONTH_NAMES.map((name, index) => (
          <option key={name} value={index + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        value={pendingYear}
        onChange={(e) => setPendingYear(Number(e.target.value))}
        className="bg-white border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-purple/40"
      >
        {yearOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onApply(pendingMonth, pendingYear)}
        className="flex items-center gap-1.5 bg-brand-purple text-white text-sm font-semibold px-3 py-2 rounded-xl"
      >
        <Filter size={14} />
        Terapkan
      </button>

      {isFilterActive && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-slate-400 hover:text-brand-red text-xs font-semibold px-2 py-2"
        >
          <X size={14} />
          Reset
        </button>
      )}
    </div>
  );
}

export { MONTH_NAMES };
