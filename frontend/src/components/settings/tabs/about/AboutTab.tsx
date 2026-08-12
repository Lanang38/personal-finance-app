import { SettingsSection } from '../SettingsSection';
import type { JSX } from 'react';

export function AboutTab(): JSX.Element {
  return (
    <SettingsSection title="Tentang">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          Versi aplikasi
        </span>
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          1.0.0
        </span>
      </div>
    </SettingsSection>
  );
}
