import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Budget } from '../../types';
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
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const numericLimit = Number(limitAmount);

    if (!numericLimit || numericLimit <= 0) return;

    setIsSaving(true);

    try {
      await onSave(budget.id, numericLimit);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-800">Edit Anggaran</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">
              Kategori
            </label>

            <input
              type="text"
              value={budget.category.name}
              disabled
              className="w-full bg-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-500"
            />
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
              className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl text-sm"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-brand-purple text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
