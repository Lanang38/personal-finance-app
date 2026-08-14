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
      <BudgetForm
        availableCategories={availableCategories}
        isReady={isReady}
        onSubmit={async (payload) => {
          await onSubmit(payload);
          onClose();
        }}
        onClose={onClose}
      />
    </PopUp>
  );
}
