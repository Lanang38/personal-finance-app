import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { WalletChart } from '../components/dashboard/WalletChart';
import { AnalysisDonut } from '../components/analysis/AnalysisDonut';
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
    // Ambil summary & insights secara independen: kalau salah satu gagal
    // (mis. Gemini API error), yang lain tetap tampil.
    const [summaryResult, insightsResult] = await Promise.allSettled([
      fetchDashboardSummary(),
      fetchInsights(),
    ]);

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value);
    } else {
      console.error('Gagal memuat ringkasan dashboard:', summaryResult.reason);
    }

    if (insightsResult.status === 'fulfilled') {
      setInsights(insightsResult.value);
    } else {
      console.error('Gagal memuat insight AI:', insightsResult.reason);
    }

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WalletChart
              data={summary?.dailySeries ?? []}
              caption={insights?.widgetInsights.expenseTrend}
            />
          </div>
          <div>
            <AnalysisDonut
              expenseByCategory={summary?.expenseByCategory ?? []}
              incomeByCategory={summary?.incomeByCategory ?? []}
              accounts={accounts}
              isAccountsLoading={isAccountsLoading}
              captions={{
                expense: insights?.widgetInsights.expenseByCategory,
                income: insights?.widgetInsights.incomeByCategory,
                accounts: insights?.widgetInsights.accounts,
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
