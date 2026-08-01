import { FormEvent, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Account, Category, TransactionType } from '../../types';
import { getErrorMessage } from '../../api/client';
import { WarningModal } from '../warning/WarningModal';
import type { JSX } from 'react';

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (payload: {
    accountId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
  }) => Promise<void>;
}

function getToday(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset();

  return new Date(today.getTime() - offset * 60000).toISOString().split('T')[0];
}

export function TransactionForm({
  accounts,
  categories,
  onSubmit,
}: TransactionFormProps): JSX.Element {
  const [type, setType] = useState<TransactionType>('expense');
  const [accountId, setAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(getToday());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.kind === type);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!accountId || !categoryId || !amount || !date) {
      setWarningMessage(
        'Harap lengkapi semua data transaksi (kecuali catatan) sebelum menyimpan',
      );
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setWarningMessage('Jumlah harus lebih besar dari 0');
      return;
    }

    if (type === 'expense') {
      const selectedAccount = accounts.find((a) => a.id === accountId);
      if (selectedAccount && numericAmount > selectedAccount.balance) {
        setWarningMessage('Saldo akun tidak mencukupi untuk transaksi ini');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        accountId,
        categoryId,
        type,
        amount: numericAmount,
        description,
        date,
      });
      setType('expense');
      setAccountId('');
      setCategoryId('');
      setAmount('');
      setDescription('');
      setDate(getToday());
    } catch (error) {
      setWarningMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
      >
        <h2 className="font-bold text-lg text-slate-800">Tambah Transaksi</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategoryId('');
            }}
            className={`flex-1 py-2 rounded-xl font-semibold text-sm ${
              type === 'expense'
                ? 'bg-brand-red text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategoryId('');
            }}
            className={`flex-1 py-2 rounded-xl font-semibold text-sm ${
              type === 'income'
                ? 'bg-brand-purple text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Pemasukan
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Jumlah (Rp)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">
              Akun
            </label>
            <div className="relative">
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full appearance-none bg-slate-100 rounded-xl pl-4 pr-9 py-2.5 outline-none"
              >
                <option value="">Pilih akun</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
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
              Kategori
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none bg-slate-100 rounded-xl pl-4 pr-9 py-2.5 outline-none"
              >
                <option value="">Pilih kategori</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Tanggal
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Catatan
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opsional"
            className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-purple text-white font-semibold py-3 rounded-xl disabled:opacity-60"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>

      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </>
  );
}
