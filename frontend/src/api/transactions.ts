import { apiClient } from "./client";
import { Transaction, Pagination, TransactionType } from "../types";

export interface TransactionListParams {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

export async function fetchTransactions(
  params: TransactionListParams
): Promise<TransactionListResponse> {
  const { data } = await apiClient.get<TransactionListResponse>("/transactions", { params });
  return data;
}

export interface CreateTransactionPayload {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date?: string;
}

export async function createTransactionRequest(
  payload: CreateTransactionPayload
): Promise<Transaction> {
  const { data } = await apiClient.post<{ transaction: Transaction }>("/transactions", payload);
  return data.transaction;
}

export async function deleteTransactionRequest(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}
