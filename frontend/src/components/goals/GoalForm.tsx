import { FormEvent, useState } from 'react';
import type { JSX } from 'react';
import { CalendarDays } from 'lucide-react';

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

        <div className="relative">
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-xl bg-slate-100 dark:bg-dark-background px-4 py-2.5 pr-10 outline-none text-slate-700 dark:text-slate-100 scheme-light dark:scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <CalendarDays
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
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
