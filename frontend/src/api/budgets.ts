import { apiClient } from './client';
import { Budget } from '../types';

export interface BudgetListResponse {
  month: string;
  budgets: Budget[];
}

export async function fetchBudgets(month: string): Promise<BudgetListResponse> {
  const { data } = await apiClient.get<BudgetListResponse>('/budgets', {
    params: { month },
  });
  return data;
}

export interface CreateBudgetPayload {
  categoryId: string;
  month: string;
  limitAmount: number;
}

export async function createBudgetRequest(
  payload: CreateBudgetPayload,
): Promise<void> {
  await apiClient.post('/budgets', payload);
}

export async function updateBudgetRequest(
  id: string,
  limitAmount: number,
): Promise<void> {
  await apiClient.patch(`/budgets/${id}`, { limitAmount });
}

export async function deleteBudgetRequest(id: string): Promise<void> {
  await apiClient.delete(`/budgets/${id}`);
}

export async function fetchAvailableMonths(): Promise<string[]> {
  const { data } = await apiClient.get<{ months: string[] }>(
    '/budgets/available-months',
  );
  return data.months;
}
