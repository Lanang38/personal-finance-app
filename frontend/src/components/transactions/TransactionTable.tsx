import { useState, useMemo } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction, PopulatedRef } from '../../types';
import { ConfirmModal } from '../alert/Confirm';
import type { JSX } from 'react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
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
      <div className="bg-white rounded-3xl p-6 shadow-sm overflow-x-auto">
        <h2 className="font-bold text-lg text-slate-800 mb-4">
          Riwayat Transaksi
        </h2>

        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Belum ada transaksi
          </p>
        ) : (
          <>
            <table className="w-full min-w-150 text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                  <th className="py-3 font-semibold">Tanggal</th>
                  <th className="py-3 font-semibold">Akun</th>
                  <th className="py-3 font-semibold">Kategori</th>
                  <th className="py-3 font-semibold">Catatan</th>
                  <th className="py-3 font-semibold">Jumlah</th>
                  <th className="py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-3 text-slate-600">
                      {formatDate(tx.date)}
                    </td>

                    <td className="py-3 text-slate-600">
                      {refName(tx.accountId)}
                    </td>

                    <td className="py-3 text-slate-600">
                      {refName(tx.categoryId)}
                    </td>

                    <td className="py-3 text-slate-500">
                      {tx.description || '-'}
                    </td>

                    <td
                      className={`py-3 font-semibold ${
                        tx.type === 'income'
                          ? 'text-brand-purple'
                          : 'text-brand-red'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>

                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(tx._id)}
                        className="text-slate-400 transition-colors hover:text-brand-red"
                        aria-label="Hapus transaksi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Sebelumnya
                </button>

                <span className="text-xs text-slate-400">
                  Halaman {safePage} dari {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Selanjutnya
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
