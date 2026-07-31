import { Trash2 } from "lucide-react";
import { Transaction, PopulatedRef } from "../../types";
import type { JSX } from 'react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function isPopulated(ref: PopulatedRef | string): ref is PopulatedRef {
  return typeof ref === "object";
}

function refName(ref: PopulatedRef | string): string {
  return isPopulated(ref) ? ref.name : "-";
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps): JSX.Element {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm overflow-x-auto">
      <h2 className="font-bold text-lg text-slate-800 mb-4">Riwayat Transaksi</h2>

      {transactions.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">Belum ada transaksi</p>
      ) : (
        <table className="w-full text-sm min-w-150">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
              <th className="py-3 font-semibold">Tanggal</th>
              <th className="py-3 font-semibold">Akun</th>
              <th className="py-3 font-semibold">Kategori</th>
              <th className="py-3 font-semibold">Catatan</th>
              <th className="py-3 font-semibold">Jumlah</th>
              <th className="py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-b border-slate-50 last:border-0">
                <td className="py-3 text-slate-600">{formatDate(tx.date)}</td>
                <td className="py-3 text-slate-600">{refName(tx.accountId)}</td>
                <td className="py-3 text-slate-600">{refName(tx.categoryId)}</td>
                <td className="py-3 text-slate-500">{tx.description || "-"}</td>
                <td
                  className={`py-3 font-semibold ${
                    tx.type === "income" ? "text-brand-purple" : "text-brand-red"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(tx._id)}
                    className="text-slate-400 hover:text-brand-red"
                    aria-label="Hapus transaksi"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
