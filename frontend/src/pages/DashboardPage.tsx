import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { WalletChart } from '../components/dashboard/WalletChart';
import { InsightDonut } from '../components/dashboard/InsightDonut';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import {
  MonthYearFilter,
  MONTH_NAMES,
} from '../components/dashboard/MonthYearFilter';
import { fetchDashboardSummary, fetchAvailablePeriods } from '../api/dashboard';
import { downloadTransactionsCsv } from '../api/export';
import { withMinimumDelay } from '../utils/withMinimumDelay';
import { useAccounts } from '../context/AccountContext';
import { AvailablePeriod, DashboardSummary } from '../types';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { JSX } from 'react';

interface ActiveFilter {
  month: number;
  year: number;
}

interface WidgetConfig {
  key: string;
  label: string;
  subtitle?: string;
  value: string;
  colorClass: string;
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function DashboardPage(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [availablePeriods, setAvailablePeriods] = useState<AvailablePeriod[]>(
    [],
  );
  const [isLoadingPeriods, setIsLoadingPeriods] = useState<boolean>(true);
  const hasLoadedOnce = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { accounts, isLoading: isAccountsLoading } = useAccounts();

  function scrollWidgets(direction: 'left' | 'right'): void {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({
      left:
        direction === 'left' ? -container.clientWidth : container.clientWidth,
      behavior: 'smooth',
    });
  }

  const loadSummary = useCallback(async (filter: ActiveFilter | null) => {
    if (!hasLoadedOnce.current) {
      // Hanya tampilkan skeleton penuh pada pemuatan pertama kali.
      setIsInitialLoading(true);
      const data = await withMinimumDelay(
        fetchDashboardSummary(filter?.month, filter?.year),
      );
      setSummary(data);
      setIsInitialLoading(false);
      hasLoadedOnce.current = true;
      return;
    }

    // Perubahan filter setelahnya tidak lagi memicu skeleton, cukup
    // perbarui data secara halus (transisi ditangani oleh framer-motion).
    setIsRefreshing(true);
    try {
      const data = await fetchDashboardSummary(filter?.month, filter?.year);
      setSummary(data);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary(activeFilter);
  }, [loadSummary, activeFilter]);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingPeriods(true);
    fetchAvailablePeriods()
      .then((periods) => {
        if (isMounted) setAvailablePeriods(periods);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPeriods(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleExport(): Promise<void> {
    setIsExporting(true);
    try {
      await downloadTransactionsCsv();
    } finally {
      setIsExporting(false);
    }
  }

  const totalSaldoAkun = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  const periodLabel = activeFilter
    ? `${MONTH_NAMES[activeFilter.month - 1]} ${activeFilter.year}`
    : 'Semua Data';

  const widgets: WidgetConfig[] = summary
    ? [
        {
          key: 'saldo-total',
          label: 'Saldo Total',
          value: formatCurrency(totalSaldoAkun),
          colorClass: 'bg-gradient-to-br from-slate-700 to-slate-900',
        },
        {
          key: 'saldo-bersih',
          label: 'Saldo Bersih',
          value: formatCurrency(summary.balance),
          colorClass: 'bg-gradient-to-br from-brand-blue to-sky-400',
        },
        {
          key: 'total-pemasukan',
          label: 'Total Pemasukan',
          subtitle: 'Semua Data',
          value: formatCurrency(summary.totalIncome),
          colorClass:
            'bg-gradient-to-br from-brand-purple to-brand-purpleLight',
        },
        {
          key: 'total-pengeluaran',
          label: 'Total Pengeluaran',
          subtitle: 'Semua Data',
          value: formatCurrency(summary.totalExpense),
          colorClass: 'bg-gradient-to-br from-rose-600 to-brand-red',
        },
        {
          key: 'pemasukan',
          label: 'Pemasukan',
          subtitle: periodLabel,
          value: formatCurrency(summary.monthIncome),
          colorClass: 'bg-gradient-to-br from-emerald-600 to-emerald-400',
        },
        {
          key: 'pengeluaran',
          label: 'Pengeluaran',
          subtitle: periodLabel,
          value: formatCurrency(summary.monthExpense),
          colorClass: 'bg-gradient-to-br from-brand-orange to-amber-400',
        },
      ]
    : [];

  const widgetsPerPage = 3;
  const widgetPages: WidgetConfig[][] = [];
  for (let i = 0; i < widgets.length; i += widgetsPerPage) {
    widgetPages.push(widgets.slice(i, i + widgetsPerPage));
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-700">Ringkasan Keuangan</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <MonthYearFilter
            activeMonth={activeFilter?.month ?? null}
            activeYear={activeFilter?.year ?? null}
            availablePeriods={availablePeriods}
            isLoadingPeriods={isLoadingPeriods}
            onApply={(month, year) => setActiveFilter({ month, year })}
            onReset={() => setActiveFilter(null)}
          />
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-60"
          >
            <Download size={16} />
            {isExporting ? 'Mengekspor...' : 'Ekspor CSV'}
          </button>
        </div>
      </div>

      {isInitialLoading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <motion.div
          animate={{ opacity: isRefreshing ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => scrollWidgets('left')}
              aria-label="Geser ke kiri"
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-500 hover:text-brand-purple hover:border-brand-purple/40 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {widgetPages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="w-full flex-shrink-0 snap-start grid grid-cols-1 sm:grid-cols-3 gap-4 pr-4 last:pr-0"
                >
                  {page.map((widget) => (
                    <StatCard
                      key={widget.key}
                      label={widget.label}
                      subtitle={widget.subtitle}
                      value={widget.value}
                      colorClass={widget.colorClass}
                    />
                  ))}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollWidgets('right')}
              aria-label="Geser ke kanan"
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-500 hover:text-brand-purple hover:border-brand-purple/40 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WalletChart data={summary.dailySeries} />
            </div>
            <div>
              <InsightDonut
                expenseByCategory={summary.expenseByCategory}
                incomeByCategory={summary.incomeByCategory}
                accounts={accounts}
                isAccountsLoading={isAccountsLoading}
              />
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
