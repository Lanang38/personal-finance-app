export type AuthProvider = 'local' | 'google';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: AuthProvider;
}

export type AccountType = 'cash' | 'bank' | 'e-wallet' | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  balance: number;
}

export type CategoryKind = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
}

export type TransactionType = 'income' | 'expense';

export interface PopulatedRef {
  _id: string;
  name: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  accountId: PopulatedRef | string;
  categoryId: PopulatedRef | string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DailyPoint {
  date: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdownPoint {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
}

export interface AvailablePeriod {
  year: number;
  month: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthIncome: number;
  monthExpense: number;
  isFiltered: boolean;
  month: number | null;
  year: number | null;
  dailySeries: DailyPoint[];
  expenseByCategory: CategoryBreakdownPoint[];
  incomeByCategory: CategoryBreakdownPoint[];
}
