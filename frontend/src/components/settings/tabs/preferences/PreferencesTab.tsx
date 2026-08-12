import { Wallet } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { ComingSoonBadge } from '../../ComingSoonBadge';
import type { JSX } from 'react';

export function PreferencesTab(): JSX.Element {
  return (
    <SettingsSection
      title="Preferensi Keuangan"
      description="Mata uang utama untuk semua laporan"
    >
      <div className="flex items-center justify-between opacity-60">
        <div className="flex items-center gap-3">
          <Wallet size={18} className="text-slate-400" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Mata uang (IDR)
          </p>
        </div>
        <ComingSoonBadge />
      </div>
    </SettingsSection>
  );
}
