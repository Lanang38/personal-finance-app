import { FormEvent, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CategoryKind } from '../../types';
import type { JSX } from 'react';

interface CategoryFormProps {
  onSubmit: (payload: { name: string; kind: CategoryKind }) => Promise<void>;
}

export function CategoryForm({ onSubmit }: CategoryFormProps): JSX.Element {
  const [name, setName] = useState<string>('');
  const [kind, setKind] = useState<CategoryKind>('expense');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({ name: name.trim(), kind });

      setName('');
      setKind('expense');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-3 h-fit"
    >
      <h2 className="font-bold text-slate-800 dark:text-slate-100">
        Kategori Baru
      </h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kategori"
        className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none text-sm"
      />

      <div className="relative">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as CategoryKind)}
          className="w-full appearance-none bg-slate-100 dark:bg-dark-background rounded-xl pl-4 pr-10 py-2.5 outline-none text-sm cursor-pointer"
        >
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-purple dark:bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
      >
        {isSubmitting ? 'Menyimpan...' : 'Tambah Kategori'}
      </button>
    </form>
  );
}
