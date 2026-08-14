import { FormEvent, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Category, CategoryKind } from '../../types';
import { getErrorMessage } from '../../api/client';
import { Warning } from '../alert/Warning';
import { PopUp } from '../common/PopUp';
import type { JSX } from 'react';

interface CategoryEditModalProps {
  category: Category;
  onClose: () => void;
  onSave: (
    id: string,
    payload: { name: string; kind: CategoryKind },
  ) => Promise<void>;
}

export function CategoryEditModal({
  category,
  onClose,
  onSave,
}: CategoryEditModalProps): JSX.Element {
  const [name, setName] = useState<string>(category.name);
  const [kind, setKind] = useState<CategoryKind>(category.kind);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!name.trim()) return;

    setIsSaving(true);

    try {
      await onSave(category.id, {
        name: name.trim(),
        kind,
      });

      onClose();
    } catch (error) {
      setWarningMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <PopUp onClose={onClose}>
        <div className="relative bg-white dark:bg-dark-component rounded-3xl p-6 shadow-lg w-full max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Edit Kategori
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nama */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Nama Kategori
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kategori"
                className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none text-sm"
              />
            </div>

            {/* Jenis */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Jenis
              </label>

              <div className="relative">
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as CategoryKind)}
                  className="w-full appearance-none bg-slate-100 dark:bg-dark-background rounded-xl px-4 pr-10 py-2.5 outline-none text-sm"
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 dark:bg-dark-background text-slate-600 dark:text-slate-100 font-semibold py-2.5 rounded-xl text-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-brand-purple dark:bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60 transition-opacity"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </PopUp>

      {warningMessage && (
        <Warning
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </>
  );
}
