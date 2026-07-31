import { apiClient } from './client';
import { DashboardSummary } from '../types';

export async function fetchDashboardSummary(
  month?: number,
  year?: number,
): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary', {
    params: { month, year },
  });
  return data;
}
