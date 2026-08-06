import { FormEvent, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Category, CategoryKind } from '../../types';
import { getErrorMessage } from '../../api/client';
import { Warning } from '../alert/Warning';
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
      <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-lg">Edit Kategori</h2>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kategori"
              className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none text-sm"
            />

            <div className="relative">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as CategoryKind)}
                className="w-full appearance-none bg-slate-100 rounded-xl px-4 pr-10 py-2.5 outline-none text-sm"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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

      {warningMessage && (
        <Warning
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </>
  );
}
