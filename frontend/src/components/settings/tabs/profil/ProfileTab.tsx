import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { Pencil, Camera } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { PopUp } from '../../../common/PopUp';
import { useAuth } from '../../../../context/AuthContext';
import {
  updateProfileRequest,
  updateAvatarRequest,
} from '../../../../api/users';
import { getErrorMessage } from '../../../../api/client';
import { ChangePasswordForm } from './ChangePasswordForm';
import type { JSX } from 'react';

export function ProfileTab(): JSX.Element {
  const { user, updateUser } = useAuth();
  const isGoogleUser = user?.authProvider === 'google';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(user?.name ?? '');
  const [nicknameInput, setNicknameInput] = useState<string>(
    user?.nickname ?? '',
  );
  const [isSavingIdentity, setIsSavingIdentity] = useState<boolean>(false);
  const [identityError, setIdentityError] = useState<string>('');

  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<string>('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  function openModal(): void {
    setNameInput(user?.name ?? '');
    setNicknameInput(user?.nickname ?? '');
    setIdentityError('');
    setIsModalOpen(true);
  }

  async function handleSaveIdentity(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setIdentityError('');

    // Akun Google cuma boleh ubah nama panggilan — backend juga tetap
    // menolak kalau nama benar-benar diubah, ini lapis validasi kedua.
    const payload = isGoogleUser
      ? { nickname: nicknameInput.trim() }
      : { name: nameInput.trim(), nickname: nicknameInput.trim() };

    if (!isGoogleUser && !nameInput.trim()) {
      setIdentityError('Nama tidak boleh kosong');
      return;
    }

    setIsSavingIdentity(true);
    try {
      const updated = await updateProfileRequest(payload);
      updateUser(updated);
      setIsModalOpen(false);
    } catch (error) {
      setIdentityError(getErrorMessage(error));
    } finally {
      setIsSavingIdentity(false);
    }
  }

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
    <>
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
            onClick={openModal}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 shrink-0"
            aria-label="Edit profil"
          >
            <Pencil size={16} />
          </button>
        </div>

        {avatarError && (
          <p className="text-sm text-brand-red mt-3">{avatarError}</p>
        )}
      </SettingsSection>

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

      <ChangePasswordSection />

      {isModalOpen && (
        <PopUp title="Edit Profil" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSaveIdentity} className="space-y-3">
            {!isGoogleUser && (
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Nama
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Opsional"
                className="w-full bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>

            {isGoogleUser && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Nama & foto profil dikelola oleh akun Google kamu, cuma nama
                panggilan yang bisa diubah di sini.
              </p>
            )}

            {identityError && (
              <p className="text-sm text-brand-red">{identityError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold py-2.5 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSavingIdentity}
                className="flex-1 bg-brand-purple text-white font-semibold py-2.5 rounded-xl disabled:opacity-60"
              >
                {isSavingIdentity ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </PopUp>
      )}
    </>
  );
}

function ChangePasswordSection(): JSX.Element {
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
