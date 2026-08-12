import { useState, FormEvent } from 'react';
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

    // Akun Google cuma boleh ubah nama panggilan — backend juga tetap
    // menolak kalau nama benar-benar diubah, ini lapis validasi kedua.
    if (!isGoogleUser && !nameInput.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    const payload = isGoogleUser
      ? { nickname: nicknameInput.trim() }
      : { name: nameInput.trim(), nickname: nicknameInput.trim() };

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
    <PopUp title="Edit Profil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
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

        {error && <p className="text-sm text-brand-red">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold py-2.5 rounded-xl"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-brand-purple text-white font-semibold py-2.5 rounded-xl disabled:opacity-60"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </PopUp>
  );
}
