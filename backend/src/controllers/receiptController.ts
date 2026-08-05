import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { extractReceiptData } from '../services/geminiService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

interface ScanReceiptBody {
  imageBase64: string;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Base64 ~4/3x ukuran asli; batasi ~6MB payload (~4.5MB gambar) supaya aman.
const MAX_BASE64_LENGTH = 6_000_000;

export const scanReceipt = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { imageBase64, mimeType } = req.body as Partial<ScanReceiptBody>;

  if (!imageBase64 || !mimeType) {
    throw new AppError('Gambar struk wajib disertakan', 400);
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new AppError(
      'Format gambar tidak didukung (gunakan JPEG/PNG/WebP)',
      400,
    );
  }
  if (imageBase64.length > MAX_BASE64_LENGTH) {
    throw new AppError('Ukuran gambar terlalu besar, coba kompres ulang', 400);
  }

  const expenseCategories = await CategoryModel.find({
    userId,
    kind: 'expense',
  });
  const categoryNames = expenseCategories.map((c) => c.name);

  const extraction = await extractReceiptData(
    imageBase64,
    mimeType,
    categoryNames,
  );

  // Cocokkan suggestedCategory (teks bebas dari Gemini) ke kategori ASLI milik
  // user secara case-insensitive. Kalau tidak ketemu, kembalikan null —
  // biarkan user pilih manual, jangan pernah membuat kategori baru otomatis.
  const matchedCategory = expenseCategories.find(
    (c) => c.name.toLowerCase() === extraction.suggestedCategory.toLowerCase(),
  );

  res.json({
    merchant: extraction.merchant,
    date: extraction.date,
    total: extraction.total,
    items: extraction.items,
    suggestedCategoryId: matchedCategory ? String(matchedCategory._id) : null,
    suggestedCategoryName: extraction.suggestedCategory,
  });
});
