import { useEffect, useRef, useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { JSX } from 'react';
import { AvailablePeriod } from '../../types';

interface MonthYearFilterProps {
  activeMonth: number | null;
  activeYear: number | null;
  availablePeriods: AvailablePeriod[];
  isLoadingPeriods: boolean;
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

export function MonthYearFilter({
  activeMonth,
  activeYear,
  availablePeriods,
  isLoadingPeriods,
  onApply,
  onReset,
}: MonthYearFilterProps): JSX.Element {
  const isFilterActive = activeMonth !== null && activeYear !== null;
  const hasData = availablePeriods.length > 0;

  // Backend sudah mengurutkan periode dari yang terbaru ke terlama.
  const latestPeriod = availablePeriods[0] ?? null;

  const [pendingMonth, setPendingMonth] = useState<number | null>(
    activeMonth ?? latestPeriod?.month ?? null,
  );
  const [pendingYear, setPendingYear] = useState<number | null>(
    activeYear ?? latestPeriod?.year ?? null,
  );

  const userTouched = useRef(false);

  // Begitu daftar periode yang tersedia datang dari server, siapkan pilihan
  // default (periode terbaru yang benar-benar punya data) selama pengguna
  // belum menyentuh dropdown dan filter belum aktif.
  useEffect(() => {
    if (userTouched.current || isFilterActive) return;
    if (latestPeriod && pendingYear === null) {
      setPendingYear(latestPeriod.year);
      setPendingMonth(latestPeriod.month);
    }
  }, [latestPeriod, isFilterActive, pendingYear]);

  const availableYears = Array.from(
    new Set(availablePeriods.map((p) => p.year)),
  ).sort((a, b) => b - a);

  const availableMonthsForYear = availablePeriods
    .filter((p) => p.year === pendingYear)
    .map((p) => p.month)
    .sort((a, b) => a - b);

  function monthsForYear(year: number): number[] {
    return availablePeriods
      .filter((p) => p.year === year)
      .map((p) => p.month)
      .sort((a, b) => a - b);
  }

  function handleYearChange(newYear: number): void {
    userTouched.current = true;
    const months = monthsForYear(newYear);
    const nextMonth =
      pendingMonth !== null && months.includes(pendingMonth)
        ? pendingMonth
        : months[months.length - 1];
    setPendingYear(newYear);
    setPendingMonth(nextMonth);
    if (isFilterActive) {
      onApply(nextMonth, newYear);
    }
  }

  function handleMonthChange(newMonth: number): void {
    userTouched.current = true;
    setPendingMonth(newMonth);
    if (isFilterActive && pendingYear !== null) {
      onApply(newMonth, pendingYear);
    }
  }

  function handleApply(): void {
    if (pendingMonth !== null && pendingYear !== null) {
      onApply(pendingMonth, pendingYear);
    }
  }

  if (isLoadingPeriods) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9.5 w-28 rounded-xl bg-slate-100 dark:bg-dark-component animate-pulse" />
        <div className="h-9.5 w-20 rounded-xl bg-slate-100 dark:bg-dark-component animate-pulse" />
        <div className="h-9.5 w-24 rounded-xl bg-slate-100 dark:bg-dark-component animate-pulse" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="text-xs font-semibold text-white bg-brand-purple  rounded-xl px-3 py-2.5">
        Belum ada data untuk difilter
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={pendingMonth ?? ''}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          className="appearance-none bg-white border dark:bg-dark-component border-slate-200 dark:border-none text-sm font-semibold text-slate-600 dark:text-slate-100 rounded-xl pl-3 pr-9 py-2 outline-none cursor-pointer"
        >
          {availableMonthsForYear.map((m) => (
            <option key={m} value={m}>
              {MONTH_NAMES[m - 1]}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-100"
        />
      </div>

      <div className="relative">
        <select
          value={pendingYear ?? ''}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="appearance-none bg-white border dark:bg-dark-component border-slate-200 dark:border-none text-sm font-semibold text-slate-600 dark:text-slate-100 rounded-xl pl-3 pr-9 py-2 outline-none cursor-pointer"
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-100"
        />
      </div>

      {isFilterActive ? (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 bg-brand-red text-white text-sm font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-colors"
        >
          <X size={14} />
          Reset
        </button>
      ) : (
        <button
          type="button"
          onClick={handleApply}
          className="flex items-center gap-1.5 bg-brand-purple dark:bg-brand-blue text-white text-sm font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Filter size={14} />
          Terapkan
        </button>
      )}
    </div>
  );
}

export { MONTH_NAMES };
