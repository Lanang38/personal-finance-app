import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { PopUp } from '../../../common/PopUp';
import { useAuth } from '../../../../context/AuthContext';
import { updateProfileRequest } from '../../../../api/users';
import { getErrorMessage } from '../../../../api/client';
import type { JSX } from 'react';

interface EditProfileModalProps {
  onClose: () => void;
}

export function EditProfileModal({
  onClose,
}: EditProfileModalProps): JSX.Element {
  const { user, updateUser } = useAuth();
  const isGoogleUser = user?.authProvider === 'google';

  const [nameInput, setNameInput] = useState<string>(user?.name ?? '');
  const [nicknameInput, setNicknameInput] = useState<string>(
    user?.nickname ?? '',
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');

    if (!isGoogleUser && !nameInput.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    const payload = isGoogleUser
      ? { nickname: nicknameInput.trim() }
      : {
          name: nameInput.trim(),
          nickname: nicknameInput.trim(),
        };

    setIsSaving(true);

    try {
      const updated = await updateProfileRequest(payload);
      updateUser(updated);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PopUp onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pr-10">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Edit Profil
          </h2>
        </div>

        {/* Tombol X - hanya tablet/mobile */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Tutup"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Nama */}
        {!isGoogleUser && (
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">
              Nama
            </label>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
        )}

        {/* Nama Panggilan */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Nama Panggilan
          </label>

          <input
            type="text"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            placeholder="Opsional"
            className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none"
          />
        </div>

        {/* Google information */}
        {isGoogleUser && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Nama & foto profil dikelola oleh akun Google kamu, cuma nama
            panggilan yang bisa diubah di sini.
          </p>
        )}

        {/* Error */}
        {error && <p className="text-sm text-brand-red">{error}</p>}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 bg-slate-100 dark:bg-dark-background text-slate-600 dark:text-slate-100 font-semibold py-2.5 rounded-xl disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-brand-purple dark:bg-brand-blue text-white font-semibold py-2.5 rounded-xl disabled:opacity-60"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </PopUp>
  );
}
