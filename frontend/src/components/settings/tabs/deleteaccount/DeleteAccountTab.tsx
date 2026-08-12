import { Trash2 } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { ComingSoonBadge } from '../../ComingSoonBadge';
import type { JSX } from 'react';

export function DeleteAccountTab(): JSX.Element {
  return (
    <SettingsSection
      title="Hapus Akun"
      description="Tindakan ini permanen dan tidak bisa dibatalkan"
    >
      <div className="flex items-center justify-between rounded-xl bg-red-50 dark:bg-red-500/10 px-4 py-3">
        <span className="flex items-center gap-3 text-sm font-medium text-brand-red">
          <Trash2 size={16} />
          Hapus akun beserta semua data transaksi, akun, anggaran, dan target
          tabungan
        </span>
        <ComingSoonBadge />
      </div>
    </SettingsSection>
  );
}
