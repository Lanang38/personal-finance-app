import { FormEvent, useState } from 'react';
import { AccountType } from '../../types';
import { getErrorMessage } from '../../api/client';
import { ChevronDown, X } from 'lucide-react';
import type { JSX } from 'react';

interface AccountFormProps {
  onSubmit: (payload: {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
  }) => Promise<void>;
  onError?: (message: string) => void;
  onClose?: () => void;
}

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'cash', label: 'Tunai' },
  { value: 'bank', label: 'Rekening Bank' },
  { value: 'e-wallet', label: 'E-Wallet' },
  { value: 'other', label: 'Lainnya' },
];

export function AccountForm({
  onSubmit,
  onError,
  onClose,
}: AccountFormProps): JSX.Element {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<AccountType>('cash');
  const [initialBalance, setInitialBalance] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        type,
        currency: 'IDR',
        initialBalance: Number(initialBalance) || 0,
      });

      setName('');
      setInitialBalance('');
    } catch (error) {
      onError?.(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-4"
    >
      {/* X Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Tutup"
          className="min-[1281px]:hidden absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>
      )}

      <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
        Tambah Akun
      </h2>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Nama Akun
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: BCA, Dompet, GoPay"
          className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Tipe Akun
        </label>

        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            className="w-full appearance-none bg-slate-100 dark:bg-dark-background rounded-xl pl-4 pr-9 py-2.5 outline-none cursor-pointer"
          >
            {accountTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Saldo Awal (Rp)
        </label>

        <input
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          placeholder="0"
          className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-purple dark:bg-brand-blue text-white font-semibold py-3 rounded-xl disabled:opacity-60"
      >
        {isSubmitting ? 'Menyimpan...' : 'Tambah Akun'}
      </button>
    </form>
  );
}
