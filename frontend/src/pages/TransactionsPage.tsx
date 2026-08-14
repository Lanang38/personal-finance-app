import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionFormModal } from '../components/transactions/TransactionFormModal';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionsTableSkeleton } from '../components/transactions/TransactionsSkeleton';

import { CategoryForm } from '../components/transactions/CategoryForm';
import { CategoryFormModal } from '../components/transactions/CategoryFormModal';
import { CategoryList } from '../components/transactions/CategoryList';
import { CategoryListSkeleton } from '../components/transactions/CategoryListSkeleton';
import { CategoryEditModal } from '../components/transactions/CategoryEdit';

import { useAccounts } from '../context/AccountContext';

import {
  fetchCategories,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from '../api/categories';

import {
  fetchTransactions,
  createTransactionRequest,
  deleteTransactionRequest,
} from '../api/transactions';

import { Warning } from '../components/alert/Warning';
import { getErrorMessage } from '../api/client';
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

  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);

  const loadData = useCallback(async (showLoading = false): Promise<void> => {
    if (showLoading) {
      setIsLoading(true);

      const [categoryList, txResponse] = await withMinimumDelay(
        Promise.all([
          fetchCategories(),
          fetchTransactions({
            page: 1,
            limit: 20,
          }),
        ]),
      );

      setCategories(categoryList);
      setTransactions(txResponse.transactions);

      setIsLoading(false);
    } else {
      const [categoryList, txResponse] = await Promise.all([
        fetchCategories(),
        fetchTransactions({
          page: 1,
          limit: 20,
        }),
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

    setIsTransactionModalOpen(false);
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

    setIsCategoryModalOpen(false);
  }

  async function handleUpdateCategory(
    id: string,
    payload: {
      name: string;
      kind: CategoryKind;
    },
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
      {/* DESKTOP */}
      <div className="hidden min-[1281px]:grid grid-cols-3 gap-6">
        {/* LEFT - Transaction Form */}
        <div>
          <TransactionForm
            accounts={accounts}
            categories={categories}
            onSubmit={handleCreateTransaction}
          />
        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-6">
          {/* Transaction Table */}
          {isLoading ? (
            <TransactionsTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onAdd={() => setIsTransactionModalOpen(true)}
            />
          )}

          {/* Category Form + Category List */}
          <div className="grid grid-cols-2 gap-6">
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
                  onAdd={() => setIsCategoryModalOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLET */}
      <div className="hidden min-[768px]:grid min-[1281px]:hidden grid-cols-3 gap-6">
        {/* Transaction Table - 2/3 */}
        <div className="col-span-2 min-w-0">
          {isLoading ? (
            <TransactionsTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onAdd={() => setIsTransactionModalOpen(true)}
            />
          )}
        </div>

        {/* Category List - 1/3 */}
        <div className="col-span-1 h-64 min-w-0">
          {isLoading ? (
            <CategoryListSkeleton />
          ) : (
            <CategoryList
              categories={categories}
              onEdit={setEditingCategory}
              onDelete={handleDeleteCategory}
              onAdd={() => setIsCategoryModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* MOBILE */}
      <div className="min-[768px]:hidden space-y-6">
        {/* Transaction Table */}
        <div className="min-w-0">
          {isLoading ? (
            <TransactionsTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onAdd={() => setIsTransactionModalOpen(true)}
            />
          )}
        </div>

        {/* Category List */}
        <div className="h-64 min-w-0">
          {isLoading ? (
            <CategoryListSkeleton />
          ) : (
            <CategoryList
              categories={categories}
              onEdit={setEditingCategory}
              onDelete={handleDeleteCategory}
              onAdd={() => setIsCategoryModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* TRANSACTION MODAL */}
      {isTransactionModalOpen && (
        <TransactionFormModal
          accounts={accounts}
          categories={categories}
          onSubmit={handleCreateTransaction}
          onClose={() => setIsTransactionModalOpen(false)}
        />
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <CategoryFormModal
          onSubmit={handleAddCategory}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <CategoryEditModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleUpdateCategory}
        />
      )}

      {/* WARNING */}
      {warningMessage && (
        <Warning
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
