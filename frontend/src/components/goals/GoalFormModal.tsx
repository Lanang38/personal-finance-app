import { X } from 'lucide-react';
import { GoalForm } from './GoalForm';
import { PopUp } from '../common/PopUp';
import type { JSX } from 'react';

interface GoalFormModalProps {
  onSubmit: (payload: {
    name: string;
    targetAmount: number;
    targetDate: string | null;
  }) => Promise<void>;
  onClose: () => void;
}

export function GoalFormModal({
  onSubmit,
  onClose,
}: GoalFormModalProps): JSX.Element {
  async function handleSubmit(payload: {
    name: string;
    targetAmount: number;
    targetDate: string | null;
  }): Promise<void> {
    await onSubmit(payload);
    onClose();
  }

  return (
    <PopUp onClose={onClose}>
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <GoalForm onSubmit={handleSubmit} />
      </div>
    </PopUp>
  );
}
