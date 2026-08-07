import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { CategoryForm } from '../components/transactions/CategoryForm';
import { CategoryList } from '../components/transactions/CategoryList';
import { CategoryEditModal } from '../components/transactions/CategoryEdit';
import { TransactionsTableSkeleton } from '../components/transactions/TransactionsSkeleton';
import { CategoryListSkeleton } from '../components/transactions/CategoryListSkeleton';
import { useAccounts } from '../context/AccountContext';
import {
  fetchCategories,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from '../api/categories';
import { Warning } from '../components/alert/Warning';
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

  async function handleAddCategory(payload: {
    name: string;
    kind: CategoryKind;
  }): Promise<void> {
    await createCategoryRequest(payload);
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
              <CategoryForm onSubmit={handleAddCategory} />
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
        <Warning
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
