import { Pencil, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import type { JSX } from 'react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps): JSX.Element {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <h2 className="font-bold text-slate-800 mb-4 shrink-0">List Kategori</h2>

      {categories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-400">Belum ada kategori</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5"
              >
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    category.kind === 'expense'
                      ? 'bg-brand-red'
                      : 'bg-brand-purple'
                  }`}
                />

                <span className="text-sm text-slate-700 font-medium truncate">
                  {category.name}
                </span>

                <span className="text-xs text-slate-400 ml-1">
                  {category.kind === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>

                <div className="ml-auto flex items-center gap-3">
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
