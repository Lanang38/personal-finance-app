import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Budget } from '../../types';
import { PopUp } from '../common/PopUp';
import type { JSX } from 'react';

interface BudgetEditModalProps {
  budget: Budget;
  onClose: () => void;
  onSave: (id: string, limitAmount: number) => Promise<void>;
}

export function BudgetEditModal({
  budget,
  onClose,
  onSave,
}: BudgetEditModalProps): JSX.Element {
  const [limitAmount, setLimitAmount] = useState<string>(
    String(budget.limitAmount),
  );

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');

    const numericLimit = Number(limitAmount);

    if (!numericLimit || numericLimit <= 0) {
      setError('Batas anggaran harus lebih besar dari 0');
      return;
    }

    setIsSaving(true);

    try {
      await onSave(budget.id, numericLimit);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memperbarui anggaran',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PopUp onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-lg space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pr-10">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Edit Anggaran
          </h2>
        </div>

        {/* Tombol X */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Tutup"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Kategori */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Kategori
          </label>

          <input
            type="text"
            value={budget.category.name}
            disabled
            className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-100"
          />
        </div>

        {/* Batas Anggaran */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            Batas Anggaran (Rp)
          </label>

          <input
            type="number"
            min={0}
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            disabled={isSaving}
            className="w-full bg-slate-100 dark:bg-dark-background dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-60"
          />
        </div>

        {/* Error */}
        {error && <p className="text-sm text-brand-red">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 bg-slate-100 dark:bg-dark-background text-slate-600 dark:text-slate-100 font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-brand-purple dark:bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </PopUp>
  );
}
