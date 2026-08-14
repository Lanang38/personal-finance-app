import { FormEvent, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Category } from '../../types';
import type { JSX } from 'react';

interface BudgetFormProps {
  availableCategories: Category[];
  isReady: boolean;
  onSubmit: (payload: {
    categoryId: string;
    limitAmount: number;
  }) => Promise<void>;
}

export function BudgetForm({
  availableCategories,
  isReady,
  onSubmit,
}: BudgetFormProps): JSX.Element {
  const [categoryId, setCategoryId] = useState<string>('');
  const [limitAmount, setLimitAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const budgetableCategories = useMemo(
    () =>
      availableCategories.filter(
        (category) => category.name.trim().toLowerCase() !== 'tabungan',
      ),
    [availableCategories],
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');

    const numericLimit = Number(limitAmount);

    if (!categoryId) {
      setError('Pilih kategori terlebih dahulu');
      return;
    }

    if (!numericLimit || numericLimit <= 0) {
      setError('Batas anggaran harus lebih besar dari 0');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        categoryId,
        limitAmount: numericLimit,
      });

      setCategoryId('');
      setLimitAmount('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-4"
    >

      <h2 className="font-bold text-slate-800 dark:text-slate-100">
        Tambah Anggaran
      </h2>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Kategori
        </label>

        <div className="relative">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full appearance-none bg-slate-100 dark:bg-dark-background rounded-xl pl-4 pr-9 py-2.5 outline-none"
          >
            <option value="">Pilih kategori</option>

            {budgetableCategories.map((category) => (
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

        {isReady && budgetableCategories.length === 0 && (
          <p className="text-xs text-slate-400 mt-1">
            Semua kategori pengeluaran sudah punya anggaran bulan ini
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Batas Anggaran (Rp)
        </label>

        <input
          type="number"
          min={0}
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          placeholder="0"
          className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || (!budgetableCategories.length && isReady)}
        className="w-full bg-brand-purple dark:bg-brand-blue text-white font-semibold py-3 rounded-xl disabled:opacity-60"
      >
        {isSubmitting ? 'Menyimpan...' : 'Tambah Anggaran'}
      </button>
    </form>
  );
}
