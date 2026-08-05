import { apiClient } from './client';
import { ReceiptScanResult } from '../types';
import { compressImage } from '../utils/compressImage';

export async function scanReceiptRequest(
  file: File,
): Promise<ReceiptScanResult> {
  const { base64, mimeType } = await compressImage(file);

  const { data } = await apiClient.post<ReceiptScanResult>('/receipts/scan', {
    imageBase64: base64,
    mimeType,
  });

  return data;
}
