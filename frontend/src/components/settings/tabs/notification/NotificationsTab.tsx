import { Bell } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { ComingSoonBadge } from '../../ComingSoonBadge';
import type { JSX } from 'react';

export function NotificationsTab(): JSX.Element {
  return (
    <SettingsSection
      title="Notifikasi"
      description="Pengingat anggaran dan target tabungan"
    >
      <div className="flex items-center justify-between opacity-60">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-slate-400" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Notifikasi push
          </p>
        </div>
        <ComingSoonBadge />
      </div>
    </SettingsSection>
  );
}
