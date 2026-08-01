import { AlertTriangle } from 'lucide-react';
import type { JSX } from 'react';

interface WarningModalProps {
  message: string;
  onClose: () => void;
}

export function WarningModal({
  message,
  onClose,
}: WarningModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={22} />
        </div>
        <h2 className="font-bold text-slate-800 mb-2">Peringatan</h2>
        <p className="text-sm text-slate-500 mb-5">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-brand-purple text-white font-semibold py-2.5 rounded-xl text-sm"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
