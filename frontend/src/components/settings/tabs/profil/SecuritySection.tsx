import { SettingsSection } from '../../SettingsSection';
import { useAuth } from '../../../../context/AuthContext';
import { ChangePasswordForm } from './ChangePasswordForm';
import type { JSX } from 'react';

export function SecuritySection(): JSX.Element {
  const { user } = useAuth();
  const isGoogleUser = user?.authProvider === 'google';

  if (isGoogleUser) {
    return (
      <SettingsSection title="Keamanan">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Masuk dengan Google
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Dikelola oleh akun Google kamu
            </p>
          </div>
        </div>
      </SettingsSection>
    );
  }

  return <ChangePasswordForm />;
}
