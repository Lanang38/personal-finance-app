import { useState, FormEvent } from 'react';
import { SettingsSection } from '../SettingsSection';
import { changePasswordRequest } from '../../../api/users';
import { getErrorMessage } from '../../../api/client';
import type { JSX } from 'react';

export function ChangePasswordForm(): JSX.Element {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');
    setSuccess(false);

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
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SettingsSection title="Keamanan" description="Ubah password login kamu">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Password Saat Ini
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
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
            className="w-full bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
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
            className="w-full bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
          />
        </div>

        {error && <p className="text-sm text-brand-red">{error}</p>}
        {success && (
          <p className="text-sm text-brand-purple">Password berhasil diubah.</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-purple text-white font-semibold text-sm px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          {isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </form>
    </SettingsSection>
  );
}
