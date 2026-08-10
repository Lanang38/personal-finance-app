import { FormEvent, useState } from 'react';
import type { JSX } from 'react';

interface GoalFormProps {
  onSubmit: (payload: {
    name: string;
    targetAmount: number;
    targetDate: string | null;
  }) => Promise<void>;
}

export function GoalForm({ onSubmit }: GoalFormProps): JSX.Element {
  const [name, setName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');

    const numericTarget = Number(targetAmount);
    if (!name.trim()) {
      setError('Nama target wajib diisi');
      return;
    }
    if (!numericTarget || numericTarget <= 0) {
      setError('Target nominal harus lebih besar dari 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        targetAmount: numericTarget,
        targetDate: targetDate || null,
      });
      setName('');
      setTargetAmount('');
      setTargetDate('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-4"
    >
      <h2 className="font-bold text-slate-800 dark:text-slate-100">
        Tambah Target Tabungan
      </h2>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Nama Target
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: DP Rumah, Liburan, Dana Darurat"
          className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Target Nominal (Rp)
        </label>
        <input
          type="number"
          min={0}
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0"
          className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Target Tanggal <span className="text-slate-400">(opsional)</span>
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full bg-slate-100 dark:bg-dark-background dark:scheme-dark rounded-xl px-4 py-2.5 outline-none"
        />
      </div>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-purple dark:bg-brand-blue text-white font-semibold py-3 rounded-xl disabled:opacity-60"
      >
        {isSubmitting ? 'Menyimpan...' : 'Tambah Target'}
      </button>
    </form>
  );
}
