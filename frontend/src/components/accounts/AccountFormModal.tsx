import { AccountForm } from './AccountForm';
import { PopUp } from '../common/PopUp';
import { AccountType } from '../../types';
import type { JSX } from 'react';

interface AccountFormModalProps {
  onSubmit: (payload: {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
  }) => Promise<void>;
  onError?: (message: string) => void;
  onClose: () => void;
}

export function AccountFormModal({
  onSubmit,
  onError,
  onClose,
}: AccountFormModalProps): JSX.Element {
  async function handleSubmit(payload: {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
  }): Promise<void> {
    await onSubmit(payload);
    onClose();
  }

  return (
    <PopUp onClose={onClose}>
      <AccountForm
        onSubmit={handleSubmit}
        onError={onError}
        onClose={onClose}
      />
    </PopUp>
  );
}
