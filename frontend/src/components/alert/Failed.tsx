import { XCircle } from 'lucide-react';
import type { JSX } from 'react';

interface FailedModalProps {
  message: string;
  onClose: () => void;
}

export function Failed({
  message,
  onClose,
}: FailedModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-dark-component p-6 text-center shadow-lg">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-brand-red">
          <XCircle size={22} />
        </div>

        <h2 className="mb-2 font-bold text-slate-800 dark:text-slate-100">Gagal</h2>

        <p className="mb-5 text-sm text-slate-500 dark:text-slate-100">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-brand-purple dark:bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
