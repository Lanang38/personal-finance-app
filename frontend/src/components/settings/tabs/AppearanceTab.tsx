import { SettingsSection } from '../SettingsSection';
import { ThemeToggle } from '../../common/ThemeToggle';
import type { JSX } from 'react';

export function AppearanceTab(): JSX.Element {
  return (
    <SettingsSection title="Tampilan" description="Sesuaikan tema aplikasi">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">Mode warna</p>
        <ThemeToggle />
      </div>
    </SettingsSection>
  );
}
