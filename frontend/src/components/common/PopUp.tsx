import { X } from 'lucide-react';
import type { JSX, ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function PopUp({ title, onClose, children }: ModalProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-xl w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
