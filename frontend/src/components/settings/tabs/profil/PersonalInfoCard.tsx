import { SettingsSection } from '../../SettingsSection';
import { useAuth } from '../../../../context/AuthContext';
import type { JSX } from 'react';

export function PersonalInfoCard(): JSX.Element {
  const { user } = useAuth();
  const isGoogleUser = user?.authProvider === 'google';

  return (
    <SettingsSection title="Informasi Pribadi">
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">
            Email
          </p>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {user?.email}
          </p>
        </div>
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">
            Masuk dengan
          </p>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {isGoogleUser ? 'Google' : 'Email & Password'}
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
