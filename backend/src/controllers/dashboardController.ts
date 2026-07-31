import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { TransactionModel } from '../models/Transaction';
import { asyncHandler } from '../utils/asyncHandler';

interface DailyPoint {
  _id: string;
  income: number;
  expense: number;
}

interface CategoryBreakdownPoint {
  _id: string;
  categoryName: string;
  color: string;
  total: number;
}

interface SummaryQuery {
  month?: string;
  year?: string;
}

interface PeriodGroup {
  _id: { year: number; month: number };
}

export const getAvailablePeriods = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const objectId = new Types.ObjectId(userId);

    const periods = await TransactionModel.aggregate<PeriodGroup>([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    res.json(periods.map((p) => ({ year: p._id.year, month: p._id.month })));
  },
);

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const objectId = new Types.ObjectId(userId);
  const { month, year } = req.query as SummaryQuery;

  const isFiltered = Boolean(month && year);
  let targetMonth: number | null = null;
  let targetYear: number | null = null;
  let dateRange: { $gte: Date; $lte: Date } | null = null;

  if (isFiltered) {
    targetYear = Number(year);
    targetMonth = Number(month) - 1;
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
    dateRange = { $gte: startOfMonth, $lte: endOfMonth };
  }

  const periodMatch = dateRange
    ? { userId: objectId, date: dateRange }
    : { userId: objectId };

  const [
    totals,
    periodTotals,
    dailySeries,
    expenseByCategory,
    incomeByCategory,
  ] = await Promise.all([
    TransactionModel.aggregate<{ _id: string; total: number }>([
      { $match: { userId: objectId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    TransactionModel.aggregate<{ _id: string; total: number }>([
      { $match: periodMatch },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    TransactionModel.aggregate<DailyPoint>([
      { $match: periodMatch },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    TransactionModel.aggregate<CategoryBreakdownPoint>([
      {
        $match: dateRange
          ? { userId: objectId, type: 'expense', date: dateRange }
          : { userId: objectId, type: 'expense' },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          color: { $first: '$category.color' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 6 },
    ]),
    TransactionModel.aggregate<CategoryBreakdownPoint>([
      {
        $match: dateRange
          ? { userId: objectId, type: 'income', date: dateRange }
          : { userId: objectId, type: 'income' },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          color: { $first: '$category.color' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const totalIncome = totals.find((t) => t._id === 'income')?.total ?? 0;
  const totalExpense = totals.find((t) => t._id === 'expense')?.total ?? 0;
  const periodIncome = periodTotals.find((t) => t._id === 'income')?.total ?? 0;
  const periodExpense =
    periodTotals.find((t) => t._id === 'expense')?.total ?? 0;

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    monthIncome: periodIncome,
    monthExpense: periodExpense,
    isFiltered,
    month: targetMonth !== null ? targetMonth + 1 : null,
    year: targetYear,
    dailySeries: dailySeries.map((point) => ({
      date: point._id,
      income: point.income,
      expense: point.expense,
    })),
    expenseByCategory: expenseByCategory.map((point) => ({
      categoryId: String(point._id),
      categoryName: point.categoryName,
      color: point.color,
      total: point.total,
    })),
    incomeByCategory: incomeByCategory.map((point) => ({
      categoryId: String(point._id),
      categoryName: point.categoryName,
      color: point.color,
      total: point.total,
    })),
  });
});
