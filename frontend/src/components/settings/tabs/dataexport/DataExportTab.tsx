import { useState } from 'react';
import { Download } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { downloadTransactionsCsv } from '../../../../api/export';
import type { JSX } from 'react';

export function DataExportTab(): JSX.Element {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  async function handleExport(): Promise<void> {
    setIsExporting(true);
    try {
      await downloadTransactionsCsv();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <SettingsSection title="Data & Ekspor" description="Kelola data keuanganmu">
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-between rounded-xl bg-slate-50 dark:bg-dark-background px-4 py-3 disabled:opacity-60"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Download size={16} />
          {isExporting ? 'Mengekspor...' : 'Export transaksi (CSV)'}
        </span>
      </button>
    </SettingsSection>
  );
}
