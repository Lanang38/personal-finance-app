import { CircleAlert } from 'lucide-react';
import type { JSX } from 'react';

interface ConfirmModalProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  message = 'Apakah Anda yakin ingin menyimpan perubahan?',
  onConfirm,
  onCancel,
  confirmText = 'Ya, Simpan',
  cancelText = 'Batal',
}: ConfirmModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-dark-component p-6 text-center shadow-lg">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
          <CircleAlert size={22} />
        </div>

        <h2 className="mb-2 font-bold text-slate-800 dark:text-slate-100">
          Konfirmasi
        </h2>

        <p className="mb-6 text-sm text-slate-500 dark:text-slate-100">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-100 dark:bg-dark-background py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-100 transition hover:opacity-90"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-brand-purple dark:bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
