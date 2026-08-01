import { Request, Response } from 'express';
import { CategoryModel, CategoryKind } from '../models/Category';
import { TransactionModel } from '../models/Transaction';
import { BudgetModel } from '../models/Budget';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

interface CreateCategoryBody {
  name: string;
  kind: CategoryKind;
  color?: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const listCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const categories = await CategoryModel.find({ userId }).sort({
      createdAt: 1,
    });
    res.json({
      categories: categories.map((c) => ({
        id: String(c._id),
        name: c.name,
        kind: c.kind,
        color: c.color,
      })),
    });
  },
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { name, kind, color } = req.body as Partial<CreateCategoryBody>;

    if (!name || !kind) {
      throw new AppError('Nama dan jenis kategori wajib diisi', 400);
    }

    const category = await CategoryModel.create({
      userId,
      name,
      kind,
      color: color ?? '#5B21B6',
    });

    res.status(201).json({
      category: {
        id: String(category._id),
        name: category.name,
        kind: category.kind,
        color: category.color,
      },
    });
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { name, kind, color } = req.body as Partial<CreateCategoryBody>;

    if (!name && !kind && !color) {
      throw new AppError('Tidak ada data untuk diperbarui', 400);
    }

    const category = await CategoryModel.findOne({ _id: id, userId });
    if (!category) {
      throw new AppError('Kategori tidak ditemukan', 404);
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      const existingCategory = await CategoryModel.findOne({
        userId,
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
      });

      if (existingCategory) {
        throw new AppError('Kategori dengan nama tersebut sudah ada', 409);
      }

      category.name = trimmedName;
    }
    if (kind !== undefined) category.kind = kind;
    if (color !== undefined) category.color = color;

    await category.save();

    res.json({
      category: {
        id: String(category._id),
        name: category.name,
        kind: category.kind,
        color: category.color,
      },
    });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const category = await CategoryModel.findOne({ _id: id, userId });
    if (!category) {
      throw new AppError('Kategori tidak ditemukan', 404);
    }

    const usageCount = await TransactionModel.countDocuments({
      userId,
      categoryId: id,
    });

    if (usageCount > 0) {
      throw new AppError(
        'Kategori tidak dapat dihapus karena masih digunakan pada transaksi',
        409,
      );
    }

    const budgetUsageCount = await BudgetModel.countDocuments({
      userId,
      categoryId: id,
    });

    if (budgetUsageCount > 0) {
      throw new AppError(
        'Kategori tidak dapat dihapus karena masih digunakan pada anggaran',
        409,
      );
    }

    await category.deleteOne();

    res.status(204).send();
  },
);
