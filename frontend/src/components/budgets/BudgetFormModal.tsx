import { X } from 'lucide-react';
import { PopUp } from '../common/PopUp';
import { BudgetForm } from './BudgetForm';
import { Category } from '../../types';
import type { JSX } from 'react';

interface BudgetFormModalProps {
  availableCategories: Category[];
  isReady: boolean;
  onSubmit: (payload: {
    categoryId: string;
    limitAmount: number;
  }) => Promise<void>;
  onClose: () => void;
}

export function BudgetFormModal({
  availableCategories,
  isReady,
  onSubmit,
  onClose,
}: BudgetFormModalProps): JSX.Element {
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

        <BudgetForm
          availableCategories={availableCategories}
          isReady={isReady}
          onSubmit={async (payload) => {
            await onSubmit(payload);
            onClose();
          }}
        />
      </div>
    </PopUp>
  );
}