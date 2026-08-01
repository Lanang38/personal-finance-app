import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { BudgetModel } from '../models/Budget';
import { TransactionModel } from '../models/Transaction';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { AccountModel } from '../models/Account';

interface CreateBudgetBody {
  categoryId: string;
  month: string;
  limitAmount: number;
}

interface PopulatedCategory {
  _id: Types.ObjectId;
  name: string;
  color: string;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function monthRange(month: string): { start: Date; end: Date } {
  const parts = month.split('-');
  const year = Number(parts[0]);
  const mon = Number(parts[1]);
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 0, 23, 59, 59);
  return { start, end };
}

export const listBudgets = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const objectId = new Types.ObjectId(userId);

  const month =
    typeof req.query.month === 'string' && /^\d{4}-\d{2}$/.test(req.query.month)
      ? req.query.month
      : currentMonth();

  const { start, end } = monthRange(month);

  const budgets = await BudgetModel.find({ userId: objectId, month })
    .populate<{ categoryId: PopulatedCategory }>('categoryId')
    .sort({ createdAt: 1 });

  const spentAgg = await TransactionModel.aggregate<{
    _id: Types.ObjectId;
    total: number;
  }>([
    {
      $match: {
        userId: objectId,
        type: 'expense',
        date: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
  ]);

  const spentMap = new Map<string, number>(
    spentAgg.map((item) => [String(item._id), item.total]),
  );

  res.json({
    month,
    budgets: budgets.map((b) => {
      const category = b.categoryId as unknown as PopulatedCategory;
      const spent = spentMap.get(String(category._id)) ?? 0;
      return {
        id: String(b._id),
        month: b.month,
        limitAmount: b.limitAmount,
        spent,
        percentage:
          b.limitAmount > 0 ? Math.round((spent / b.limitAmount) * 100) : 0,
        category: {
          id: String(category._id),
          name: category.name,
          color: category.color,
        },
      };
    }),
  });
});

export const createBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { categoryId, month, limitAmount } =
      req.body as Partial<CreateBudgetBody>;

    if (!categoryId || !month || !limitAmount) {
      throw new AppError(
        'Kategori, bulan, dan batas anggaran wajib diisi',
        400,
      );
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new AppError('Format bulan tidak valid', 400);
    }

    const existing = await BudgetModel.findOne({ userId, categoryId, month });
    if (existing) {
      throw new AppError(
        'Anggaran untuk kategori dan bulan ini sudah ada',
        409,
      );
    }

    const budget = await BudgetModel.create({
      userId,
      categoryId,
      month,
      limitAmount,
    });

    res.status(201).json({
      budget: {
        id: String(budget._id),
        categoryId: String(budget.categoryId),
        month: budget.month,
        limitAmount: budget.limitAmount,
      },
    });
  },
);

export const updateBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { limitAmount } = req.body as { limitAmount?: number };

    const budget = await BudgetModel.findOne({ _id: id, userId });
    if (!budget) {
      throw new AppError('Anggaran tidak ditemukan', 404);
    }

    if (limitAmount !== undefined) {
      budget.limitAmount = limitAmount;
    }
    await budget.save();

    res.json({
      budget: {
        id: String(budget._id),
        categoryId: String(budget.categoryId),
        month: budget.month,
        limitAmount: budget.limitAmount,
      },
    });
  },
);

export const deleteBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const budget = await BudgetModel.findOneAndDelete({ _id: id, userId });
    if (!budget) {
      throw new AppError('Anggaran tidak ditemukan', 404);
    }

    res.status(204).send();
  },
);

export const listAvailableMonths = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const earliestAccount = await AccountModel.findOne({ userId }).sort({
      createdAt: 1,
    });

    const now = new Date();
    const startDate = earliestAccount ? earliestAccount.createdAt : now;

    const months: string[] = [];
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);

    while (cursor <= end) {
      months.push(
        `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`,
      );
      cursor.setMonth(cursor.getMonth() + 1);
    }

    res.json({ months: months.reverse() });
  },
);
