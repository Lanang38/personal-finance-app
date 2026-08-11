import { apiClient } from './client';
import { User } from '../types';
import { compressImage } from '../utils/compressImage';

export interface UpdateProfilePayload {
  name?: string;
  nickname?: string;
}

export async function updateProfileRequest(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { data } = await apiClient.patch<{ user: User }>(
    '/users/me/profile',
    payload,
  );
  return data.user;
}

export async function updateAvatarRequest(file: File): Promise<User> {
  const { base64, mimeType } = await compressImage(file);
  const { data } = await apiClient.patch<{ user: User }>('/users/me/avatar', {
    avatarBase64: base64,
    mimeType,
  });
  return data.user;
}

export async function changePasswordRequest(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await apiClient.patch('/users/me/password', { currentPassword, newPassword });
}
