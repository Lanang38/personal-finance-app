import { useState, FormEvent } from 'react';
import { SettingsSection } from '../../SettingsSection';
import { PopUp } from '../../../common/PopUp';
import { changePasswordRequest } from '../../../../api/users';
import { getErrorMessage } from '../../../../api/client';
import type { JSX } from 'react';

export function ChangePasswordForm(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  function openModal(): void {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsModalOpen(true);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok');
      return;
    }

    setIsSubmitting(true);
    try {
      await changePasswordRequest(currentPassword, newPassword);
      setIsModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SettingsSection title="Keamanan" description="Ubah password login kamu">
        <button
          type="button"
          onClick={openModal}
          className="bg-brand-purple dark:bg-brand-blue text-white font-semibold text-sm px-4 py-2.5 rounded-xl"
        >
          Ubah Password
        </button>
      </SettingsSection>

      {isModalOpen && (
        <PopUp title="Ubah Password" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Password Saat Ini
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Password Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>

            {error && <p className="text-sm text-brand-red">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-100 dark:bg-dark-background text-slate-600 dark:text-slate-300 font-semibold py-2.5 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-brand-purple dark:bg-brand-blue text-white font-semibold py-2.5 rounded-xl disabled:opacity-60"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </PopUp>
      )}
    </>
  );
}
