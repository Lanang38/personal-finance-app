import { useState, useRef, ChangeEvent } from 'react';
import { Pencil, Camera } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { useAuth } from '../../../../context/AuthContext';
import { updateAvatarRequest } from '../../../../api/users';
import { getErrorMessage } from '../../../../api/client';
import { EditProfileModal } from './EditProfileModal';
import type { JSX } from 'react';

export function ProfileCard(): JSX.Element {
  const { user, updateUser } = useAuth();
  const isGoogleUser = user?.authProvider === 'google';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<string>('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setAvatarError('');
    setIsUploadingAvatar(true);
    try {
      const updated = await updateAvatarRequest(file);
      updateUser(updated);
    } catch (error) {
      setAvatarError(getErrorMessage(error));
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <SettingsSection title="Profil">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center font-semibold text-lg overflow-hidden">
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

            {!isGoogleUser && (
              <>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center text-slate-500 dark:text-slate-300 disabled:opacity-60"
                  aria-label="Ganti foto profil"
                >
                  <Camera size={12} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user?.name}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 truncate">
              {user?.nickname || 'Belum ada nama panggilan'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 shrink-0"
          aria-label="Edit profil"
        >
          <Pencil size={16} />
        </button>
      </div>

      {avatarError && (
        <p className="text-sm text-brand-red mt-3">{avatarError}</p>
      )}

      {isModalOpen && (
        <EditProfileModal onClose={() => setIsModalOpen(false)} />
      )}
    </SettingsSection>
  );
}
