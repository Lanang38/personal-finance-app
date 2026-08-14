import { X } from 'lucide-react';
import { PopUp } from '../common/PopUp';
import { TransactionForm } from './TransactionForm';
import { Account, Category } from '../../types';
import type { JSX } from 'react';

interface TransactionFormModalProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (payload: {
    accountId: string;
    categoryId: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
  }) => Promise<void>;
  onClose: () => void;
}

export function TransactionFormModal({
  accounts,
  categories,
  onSubmit,
  onClose,
}: TransactionFormModalProps): JSX.Element {
  return (
    <PopUp onClose={onClose}>
      <div className="relative">
        {/* Tombol X */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <TransactionForm
          accounts={accounts}
          categories={categories}
          isModal
          onSubmit={onSubmit}
        />
      </div>
    </PopUp>
  );
}
