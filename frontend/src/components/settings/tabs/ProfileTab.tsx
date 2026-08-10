import { SettingsSection } from '../SettingsSection';
import { ComingSoonBadge } from '../ComingSoonBadge';
import { useAuth } from '../../../context/AuthContext';
import type { JSX } from 'react';

export function ProfileTab(): JSX.Element {
  const { user } = useAuth();

  return (
    <>
      <SettingsSection title="Profil">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center font-semibold text-lg overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.name.charAt(0) ?? '?').toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>
          <ComingSoonBadge />
        </div>
      </SettingsSection>

      <SettingsSection title="Informasi Pribadi">
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">
              Nama
            </p>
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {user?.name}
            </p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">
              Email
            </p>
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {user?.email}
            </p>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Keamanan">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {user?.authProvider === 'google'
                ? 'Masuk dengan Google'
                : 'Password'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {user?.authProvider === 'google'
                ? 'Dikelola oleh akun Google kamu'
                : 'Ubah password login kamu'}
            </p>
          </div>
          {user?.authProvider !== 'google' && <ComingSoonBadge />}
        </div>
      </SettingsSection>
    </>
  );
}
