import { useEffect, useState, useCallback, FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { CategoryList } from '../components/transactions/CategoryList';
import { CategoryEditModal } from '../components/transactions/CategoryEditModal';
import { TransactionsTableSkeleton } from '../components/transactions/TransactionsSkeleton';
import { CategoryListSkeleton } from '../components/transactions/CategoryListSkeleton';
import { useAccounts } from '../context/AccountContext';
import {
  fetchCategories,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from '../api/categories';
import { WarningModal } from '../components/transactions/WarningModal';
import { getErrorMessage } from '../api/client';
import {
  fetchTransactions,
  createTransactionRequest,
  deleteTransactionRequest,
} from '../api/transactions';
import { withMinimumDelay } from '../utils/withMinimumDelay';
import { Category, CategoryKind, Transaction } from '../types';
import type { JSX } from 'react';

export function TransactionsPage(): JSX.Element {
  const { accounts, refreshAccounts } = useAccounts();

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryKind, setNewCategoryKind] =
    useState<CategoryKind>('expense');

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadData = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);

      const [categoryList, txResponse] = await withMinimumDelay(
        Promise.all([
          fetchCategories(),
          fetchTransactions({ page: 1, limit: 20 }),
        ]),
      );

      setCategories(categoryList);
      setTransactions(txResponse.transactions);

      setIsLoading(false);
    } else {
      const [categoryList, txResponse] = await Promise.all([
        fetchCategories(),
        fetchTransactions({ page: 1, limit: 20 }),
      ]);

      setCategories(categoryList);
      setTransactions(txResponse.transactions);
    }
  }, []);

  useEffect(() => {
    void loadData(true);
  }, [loadData]);

  async function handleCreateTransaction(payload: {
    accountId: string;
    categoryId: string;
    type: 'income' | 'expense';
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

  async function handleAddCategory(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newCategoryName.trim()) return;

    await createCategoryRequest({
      name: newCategoryName.trim(),
      kind: newCategoryKind,
    });

    setNewCategoryName('');
    setNewCategoryKind('expense');

    await loadData();
  }

  async function handleUpdateCategory(
    id: string,
    payload: { name: string; kind: CategoryKind },
  ): Promise<void> {
    await updateCategoryRequest(id, payload);
    await loadData();
  }

  async function handleDeleteCategory(id: string): Promise<void> {
    try {
      await deleteCategoryRequest(id);
      await loadData();
    } catch (error) {
      setWarningMessage(getErrorMessage(error));
    }
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <TransactionForm
            accounts={accounts}
            categories={categories}
            onSubmit={handleCreateTransaction}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <TransactionsTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-62">
              <form
                onSubmit={handleAddCategory}
                className="bg-white rounded-3xl p-6 shadow-sm space-y-3 h-fit"
              >
                <h2 className="font-bold text-slate-800">Kategori Baru</h2>

                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nama kategori"
                  className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none text-sm"
                />

                <div className="relative">
                  <select
                    value={newCategoryKind}
                    onChange={(e) =>
                      setNewCategoryKind(e.target.value as CategoryKind)
                    }
                    className="w-full appearance-none bg-slate-100 rounded-xl pl-4 pr-10 py-2.5 outline-none text-sm cursor-pointer"
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
                  className="w-full bg-brand-purple text-white font-semibold py-2.5 rounded-xl text-sm"
                >
                  Tambah Kategori
                </button>
              </form>
            </div>

            <div className="h-56">
              {isLoading ? (
                <CategoryListSkeleton />
              ) : (
                <CategoryList
                  categories={categories}
                  onEdit={setEditingCategory}
                  onDelete={handleDeleteCategory}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {editingCategory && (
        <CategoryEditModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleUpdateCategory}
        />
      )}
      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
