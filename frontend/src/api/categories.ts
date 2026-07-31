import { apiClient } from './client';
import { Category, CategoryKind } from '../types';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<{ categories: Category[] }>(
    '/categories',
  );
  return data.categories;
}

export interface CreateCategoryPayload {
  name: string;
  kind: CategoryKind;
  color?: string;
}

export async function createCategoryRequest(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const { data } = await apiClient.post<{ category: Category }>(
    '/categories',
    payload,
  );
  return data.category;
}

export async function deleteCategoryRequest(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}

export interface UpdateCategoryPayload {
  name?: string;
  kind?: CategoryKind;
  color?: string;
}

export async function updateCategoryRequest(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const { data } = await apiClient.patch<{ category: Category }>(
    `/categories/${id}`,
    payload,
  );
  return data.category;
}
