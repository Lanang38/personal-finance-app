import { apiClient } from './client';
import { Goal } from '../types';

export async function fetchGoals(): Promise<Goal[]> {
  const { data } = await apiClient.get<{ goals: Goal[] }>('/goals');
  return data.goals;
}

export interface CreateGoalPayload {
  name: string;
  targetAmount: number;
  targetDate?: string | null;
}

export async function createGoalRequest(
  payload: CreateGoalPayload,
): Promise<void> {
  await apiClient.post('/goals', payload);
}

export interface UpdateGoalPayload {
  name?: string;
  targetAmount?: number;
  targetDate?: string | null;
}

export async function updateGoalRequest(
  id: string,
  payload: UpdateGoalPayload,
): Promise<void> {
  await apiClient.patch(`/goals/${id}`, payload);
}

export async function contributeGoalRequest(
  id: string,
  amount: number,
): Promise<void> {
  await apiClient.post(`/goals/${id}/contribute`, { amount });
}

export async function deleteGoalRequest(id: string): Promise<void> {
  await apiClient.delete(`/goals/${id}`);
}
