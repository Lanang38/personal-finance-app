import { useState, useMemo } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Transaction, PopulatedRef } from '../../types';
import { ConfirmModal } from '../alert/Confirm';
import type { JSX } from 'react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const PAGE_SIZE = 4;

function isPopulated(ref: PopulatedRef | string): ref is PopulatedRef {
  return typeof ref === 'object';
}

function refName(ref: PopulatedRef | string): string {
  return isPopulated(ref) ? ref.name : '-';
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TransactionTable({
  transactions,
  onDelete,
  onAdd,
}: TransactionTableProps): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const paginatedTransactions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, safePage]);

  return (
    <>
      <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Riwayat Transaksi
          </h2>

          {/* Tombol tambah */}
          <button
            type="button"
            onClick={onAdd}
            aria-label="Tambah transaksi"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-purple dark:bg-brand-blue text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Belum ada transaksi
          </p>
        ) : (
          <>
            <div className="w-full overflow-hidden">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  {/* Tanggal */}
                  <col className="w-[30%] sm:w-[17%]" />

                  {/* Akun */}
                  <col className="hidden sm:table-column sm:w-[18%] md:w-[17%]" />

                  {/* Kategori */}
                  <col className="hidden md:table-column md:w-[17%]" />

                  {/* Catatan */}
                  <col className="hidden sm:table-column sm:w-[25%] md:w-[25%]" />

                  {/* Jumlah */}
                  <col className="w-[52%] sm:w-[28%] md:w-[19%]" />

                  {/* Aksi */}
                  <col className="w-[18%] sm:w-[12%] md:w-[10%]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-400 text-left text-xs uppercase text-slate-400 dark:text-slate-100">
                    <th className="py-3 pr-2 font-semibold whitespace-nowrap">
                      Tanggal
                    </th>

                    <th className="hidden sm:table-cell py-3 pr-2 font-semibold">
                      Akun
                    </th>

                    <th className="hidden md:table-cell py-3 pr-2 font-semibold">
                      Kategori
                    </th>

                    <th className="hidden sm:table-cell py-3 pr-2 font-semibold">
                      Catatan
                    </th>

                    <th className="py-3 pl-3 pr-3 sm:pl-2 sm:pr-2 font-semibold whitespace-nowrap">
                      Jumlah
                    </th>

                    <th className="py-3 pl-2 text-right font-semibold whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTransactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="border-b border-slate-50 dark:border-slate-600 last:border-0"
                    >
                      {/* Tanggal */}
                      <td className="py-3 pr-2 text-slate-600 dark:text-slate-400 overflow-hidden">
                        <span className="block truncate whitespace-nowrap">
                          {formatDate(tx.date)}
                        </span>
                      </td>

                      {/* Akun */}
                      <td className="hidden sm:table-cell py-3 pr-2 text-slate-600 dark:text-slate-400 overflow-hidden">
                        <span className="block truncate whitespace-nowrap">
                          {refName(tx.accountId)}
                        </span>
                      </td>

                      {/* Kategori */}
                      <td className="hidden md:table-cell py-3 pr-2 text-slate-600 dark:text-slate-400 overflow-hidden">
                        <span className="block truncate whitespace-nowrap">
                          {refName(tx.categoryId)}
                        </span>
                      </td>

                      {/* Catatan */}
                      <td className="hidden sm:table-cell py-3 pr-2 text-slate-600 dark:text-slate-400 overflow-hidden">
                        <span className="block truncate whitespace-nowrap">
                          {tx.description || '-'}
                        </span>
                      </td>

                      {/* Jumlah */}
                      <td
                        className={`py-3 pl-3 pr-3 sm:pl-2 sm:pr-2 font-semibold overflow-hidden ${
                          tx.type === 'income'
                            ? 'text-brand-purple dark:text-brand-blue'
                            : 'text-brand-red'
                        }`}
                      >
                        <span className="block truncate whitespace-nowrap">
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteId(tx._id)}
                          className="inline-flex items-center justify-center text-slate-400 transition-colors hover:text-brand-red"
                          aria-label="Hapus transaksi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-600 pt-4">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-100 transition-colors hover:text-brand-purple dark:hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs text-slate-400 whitespace-nowrap">
                  Halaman {safePage} dari {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-100 transition-colors hover:text-brand-purple dark:hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          message="Apakah Anda yakin ingin menghapus transaksi ini?"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            onDelete(deleteId);
            setDeleteId(null);
          }}
        />
      )}
    </>
  );
}
