import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { WalletChart } from '../components/dashboard/WalletChart';
import { CategoryDonut } from '../components/dashboard/CategoryDonut';
import { AccountsDonut } from '../components/dashboard/AccountsDonut';
import { SuggestionPanel } from '../components/analysis/SuggestionPanel';
import { fetchDashboardSummary } from '../api/dashboard';
import { fetchInsights, dismissSuggestionRequest } from '../api/insights';
import { useAccounts } from '../context/AccountContext';
import { DashboardSummary, InsightsResponse } from '../types';
import type { JSX } from 'react';

export function AnalysisPage(): JSX.Element {
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [summaryData, insightsData] = await Promise.all([
      fetchDashboardSummary(),
      fetchInsights(),
    ]);
    setSummary(summaryData);
    setInsights(insightsData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleDismiss(conditionKey: string): Promise<void> {
    await dismissSuggestionRequest(conditionKey);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SuggestionPanel
          suggestions={insights?.suggestions ?? []}
          affirmation={insights?.affirmation ?? null}
          isLoading={isLoading}
          onDismiss={handleDismiss}
        />

        <WalletChart
          data={summary?.dailySeries ?? []}
          caption={insights?.widgetInsights.expenseTrend}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryDonut
            data={summary?.expenseByCategory ?? []}
            title="Kategori Pengeluaran"
            emptyLabel="Belum ada data pengeluaran"
            caption={insights?.widgetInsights.expenseByCategory}
          />
          <CategoryDonut
            data={summary?.incomeByCategory ?? []}
            title="Kategori Pemasukan"
            emptyLabel="Belum ada data pemasukan"
            caption={insights?.widgetInsights.incomeByCategory}
          />
          <AccountsDonut
            accounts={accounts}
            isLoading={isAccountsLoading}
            caption={insights?.widgetInsights.accounts}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
