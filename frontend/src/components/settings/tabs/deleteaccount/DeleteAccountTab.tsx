import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { SettingsSection } from '../../SettingsSection';
import { PopUp } from '../../../common/PopUp';
import { useAuth } from '../../../../context/AuthContext';
import { deleteAccountRequest } from '../../../../api/users';
import { getErrorMessage } from '../../../../api/client';
import type { JSX } from 'react';

export function DeleteAccountTab(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const isConfirmed = confirmationInput === user?.name;

  function openModal(): void {
    setConfirmationInput('');
    setError('');
    setIsModalOpen(true);
  }

  function closeModal(): void {
    if (isDeleting) return;

    setIsModalOpen(false);
    setConfirmationInput('');
    setError('');
  }

  async function handleDelete(): Promise<void> {
    if (!isConfirmed || isDeleting) return;

    setError('');
    setIsDeleting(true);

    try {
      await deleteAccountRequest(confirmationInput);

      logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleting(false);
    }
  }

  return (
    <>
      <SettingsSection
        title="Hapus Akun"
        description="Tindakan ini permanen dan tidak bisa dibatalkan"
      >
        <button
          type="button"
          onClick={openModal}
          className="w-full flex items-center justify-between rounded-xl bg-red-50 dark:bg-red-500/10 px-4 py-3"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-brand-red">
            <Trash2 size={16} />
            Hapus akun beserta semua data transaksi, akun, anggaran, dan target
            tabungan
          </span>
        </button>
      </SettingsSection>

      {isModalOpen && (
        <PopUp onClose={closeModal}>
          <div className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                Hapus Akun Permanen
              </h2>

              {/* X berada di dalam popup */}
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                aria-label="Tutup"
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Peringatan */}
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 rounded-xl px-4 py-3">
                <AlertTriangle
                  size={18}
                  className="text-brand-red mt-0.5 shrink-0"
                />

                <p className="text-sm text-brand-red">
                  Semua transaksi, akun, kategori, anggaran, dan target tabungan
                  kamu akan terhapus permanen. Tindakan ini{' '}
                  <strong>tidak bisa dibatalkan</strong>.
                </p>
              </div>

              {/* Input konfirmasi */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Ketik{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {user?.name}
                  </span>{' '}
                  untuk konfirmasi
                </label>

                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={user?.name}
                  autoComplete="off"
                  disabled={isDeleting}
                  className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none disabled:opacity-60"
                />
              </div>

              {/* Error */}
              {error && <p className="text-sm text-brand-red">{error}</p>}

              {/* Tombol */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isDeleting}
                  className="flex-1 bg-slate-100 dark:bg-dark-background text-slate-600 dark:text-slate-100 font-semibold py-2.5 rounded-xl disabled:opacity-60"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!isConfirmed || isDeleting}
                  className="flex-1 bg-brand-red text-slate-100 font-semibold py-2.5 rounded-xl disabled:opacity-40"
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
                </button>
              </div>
            </div>
          </div>
        </PopUp>
      )}
    </>
  );
}
