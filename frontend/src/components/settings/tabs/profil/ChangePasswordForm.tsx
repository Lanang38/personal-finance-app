import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
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

  function closeModal(): void {
    if (isSubmitting) return;

    setIsModalOpen(false);
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
        <PopUp onClose={closeModal}>
          <form
            onSubmit={handleSubmit}
            className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pr-10">
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                Ubah Password
              </h2>
            </div>

            {/* Tombol X */}
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              aria-label="Tutup"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              <X size={18} />
            </button>

            {/* Password Saat Ini */}
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

            {/* Password Baru */}
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

            {/* Konfirmasi Password */}
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

            {/* Error */}
            {error && <p className="text-sm text-brand-red">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1 bg-slate-100 dark:bg-dark-background text-slate-600 dark:text-slate-300 font-semibold py-2.5 rounded-xl disabled:opacity-60"
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
