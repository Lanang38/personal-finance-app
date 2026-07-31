import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { WalletChart } from '../components/dashboard/WalletChart';
import { InsightDonut } from '../components/dashboard/InsightDonut';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import {
  MonthYearFilter,
  MONTH_NAMES,
} from '../components/dashboard/MonthYearFilter';
import { fetchDashboardSummary } from '../api/dashboard';
import { downloadTransactionsCsv } from '../api/export';
import { withMinimumDelay } from '../utils/withMinimumDelay';
import { useAccounts } from '../context/AccountContext';
import { DashboardSummary } from '../types';
import { Download } from 'lucide-react';
import type { JSX } from 'react';

interface ActiveFilter {
  month: number;
  year: number;
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function DashboardPage(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const { accounts, isLoading: isAccountsLoading } = useAccounts();

  const loadSummary = useCallback(async (filter: ActiveFilter | null) => {
    setIsLoading(true);
    const data = await withMinimumDelay(
      fetchDashboardSummary(filter?.month, filter?.year),
    );
    setSummary(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadSummary(activeFilter);
  }, [loadSummary, activeFilter]);

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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-700">Ringkasan Keuangan</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <MonthYearFilter
            activeMonth={activeFilter?.month ?? null}
            activeYear={activeFilter?.year ?? null}
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

      {isLoading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              label="Saldo Total"
              value={formatCurrency(totalSaldoAkun)}
              colorClass="bg-gradient-to-br from-slate-700 to-slate-900"
            />
            <StatCard
              label="Total Pemasukan"
              value={formatCurrency(summary.totalIncome)}
              colorClass="bg-gradient-to-br from-brand-purple to-brand-purpleLight"
            />
            <StatCard
              label="Total Pengeluaran"
              value={formatCurrency(summary.totalExpense)}
              colorClass="bg-gradient-to-br from-brand-red to-rose-400"
            />
            <StatCard
              label="Saldo Bersih"
              value={formatCurrency(summary.balance)}
              colorClass="bg-gradient-to-br from-brand-blue to-sky-400"
            />
            <StatCard
              label={`Pengeluaran (${periodLabel})`}
              value={formatCurrency(summary.monthExpense)}
              colorClass="bg-gradient-to-br from-brand-orange to-amber-400"
            />
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
        </>
      )}
    </DashboardLayout>
  );
}
