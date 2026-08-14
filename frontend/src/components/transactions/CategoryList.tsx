import { Pencil, Trash2, Plus } from 'lucide-react';
import { Category } from '../../types';
import type { JSX } from 'react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  onAdd,
}: CategoryListProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm h-full min-h-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">
          List Kategori
        </h2>

        <button
          type="button"
          onClick={onAdd}
          aria-label="Tambah kategori"
          className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-purple dark:bg-brand-blue text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Belum ada kategori
          </p>
        </div>
      ) : (
        /*
         * Tetap scroll pada semua ukuran layar,
         * termasuk mobile.
         */
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scroll">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-3 bg-slate-50 dark:bg-dark-background rounded-xl px-4 py-2.5 min-w-0"
              >
                {/* Indicator */}
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    category.kind === 'expense'
                      ? 'bg-brand-red'
                      : 'bg-brand-purple dark:bg-brand-blue'
                  }`}
                />

                {/* Nama */}
                <span className="text-sm text-slate-700 dark:text-slate-100 font-medium truncate min-w-0">
                  {category.name}
                </span>

                {/* Jenis */}
                <span className="text-xs text-slate-400 ml-1 shrink-0 hidden sm:block">
                  {category.kind === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="text-slate-400 hover:text-brand-blue transition-colors"
                    aria-label="Edit kategori"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(category.id)}
                    className="text-slate-400 hover:text-brand-red transition-colors"
                    aria-label="Hapus kategori"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
