import type { JSX, ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export function PopUp({ onClose, children }: ModalProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
