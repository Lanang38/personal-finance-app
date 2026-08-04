import { apiClient } from './client';
import { InsightsResponse } from '../types';

export async function fetchInsights(): Promise<InsightsResponse> {
  const { data } = await apiClient.get<InsightsResponse>('/insights');
  return data;
}

export async function dismissSuggestionRequest(
  conditionKey: string,
): Promise<void> {
  await apiClient.post('/insights/dismiss', { conditionKey });
}
