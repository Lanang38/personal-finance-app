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
      <GoalForm onSubmit={handleSubmit} onClose={onClose} />
    </PopUp>
  );
}
