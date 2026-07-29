import { Request, Response } from "express";
import { Types } from "mongoose";
import { TransactionModel } from "../models/Transaction";
import { asyncHandler } from "../utils/asyncHandler";

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

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const objectId = new Types.ObjectId(userId);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [totals, monthTotals, dailySeries, expenseByCategory] = await Promise.all([
    TransactionModel.aggregate<{ _id: string; total: number }>([
      { $match: { userId: objectId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    TransactionModel.aggregate<{ _id: string; total: number }>([
      { $match: { userId: objectId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    TransactionModel.aggregate<DailyPoint>([
      { $match: { userId: objectId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    TransactionModel.aggregate<CategoryBreakdownPoint>([
      { $match: { userId: objectId, type: "expense" } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.name" },
          color: { $first: "$category.color" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const totalIncome = totals.find((t) => t._id === "income")?.total ?? 0;
  const totalExpense = totals.find((t) => t._id === "expense")?.total ?? 0;
  const monthIncome = monthTotals.find((t) => t._id === "income")?.total ?? 0;
  const monthExpense = monthTotals.find((t) => t._id === "expense")?.total ?? 0;

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    monthIncome,
    monthExpense,
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
  });
});
