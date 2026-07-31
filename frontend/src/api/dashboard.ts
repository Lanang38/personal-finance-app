import { apiClient } from './client';
import { AvailablePeriod, DashboardSummary } from '../types';

export async function fetchDashboardSummary(
  month?: number,
  year?: number,
): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary', {
    params: { month, year },
  });
  return data;
}

export async function fetchAvailablePeriods(): Promise<AvailablePeriod[]> {
  const { data } = await apiClient.get<AvailablePeriod[]>(
    '/dashboard/available-periods',
  );
  return data;
}
