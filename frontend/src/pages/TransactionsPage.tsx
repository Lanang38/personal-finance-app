import { useEffect, useState, useCallback, FormEvent } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { TransactionTable } from "../components/transactions/TransactionTable";
import { useAccounts } from "../context/AccountContext";
import { fetchCategories, createCategoryRequest } from "../api/categories";
import {
  fetchTransactions,
  createTransactionRequest,
  deleteTransactionRequest,
} from "../api/transactions";
import { Category, Transaction, CategoryKind, Pagination } from "../types";

export function TransactionsPage(): JSX.Element {
  const { accounts, refreshAccounts } = useAccounts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryKind, setNewCategoryKind] = useState<CategoryKind>("expense");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [categoryList, txResponse] = await Promise.all([
      fetchCategories(),
      fetchTransactions({ page: 1, limit: 20 }),
    ]);
    setCategories(categoryList);
    setTransactions(txResponse.transactions);
    setPagination(txResponse.pagination);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreateTransaction(payload: {
    accountId: string;
    categoryId: string;
    type: "income" | "expense";
    amount: number;
    description: string;
    date: string;
  }): Promise<void> {
    await createTransactionRequest(payload);
    await Promise.all([loadData(), refreshAccounts()]);
  }

  async function handleDeleteTransaction(id: string): Promise<void> {
    await deleteTransactionRequest(id);
    await Promise.all([loadData(), refreshAccounts()]);
  }

  async function handleAddCategory(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!newCategoryName.trim()) return;
    await createCategoryRequest({ name: newCategoryName.trim(), kind: newCategoryKind });
    setNewCategoryName("");
    await loadData();
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TransactionForm
            accounts={accounts}
            categories={categories}
            onSubmit={handleCreateTransaction}
          />

          <form
            onSubmit={handleAddCategory}
            className="bg-white rounded-3xl p-6 shadow-sm space-y-3"
          >
            <h2 className="font-bold text-slate-800">Kategori Baru</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nama kategori"
              className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none text-sm"
            />
            <select
              value={newCategoryKind}
              onChange={(e) => setNewCategoryKind(e.target.value as CategoryKind)}
              className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none text-sm"
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
            <button
              type="submit"
              className="w-full bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              Tambah Kategori
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-slate-400 text-sm">Memuat transaksi...</div>
          ) : (
            <>
              <TransactionTable transactions={transactions} onDelete={handleDeleteTransaction} />
              {pagination && (
                <p className="text-xs text-slate-400 text-center">
                  Menampilkan {transactions.length} dari {pagination.total} transaksi
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
