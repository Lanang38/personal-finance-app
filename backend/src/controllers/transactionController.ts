import { Request, Response } from "express";
import { TransactionModel, TransactionType } from "../models/Transaction";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

interface CreateTransactionBody {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date?: string;
}

interface ListTransactionsQuery {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { accountId, categoryId, type, from, to, page, limit } =
    req.query as ListTransactionsQuery;

  const filter: Record<string, unknown> = { userId };
  if (accountId) filter.accountId = accountId;
  if (categoryId) filter.categoryId = categoryId;
  if (type) filter.type = type;
  if (from || to) {
    const dateFilter: Record<string, Date> = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    filter.date = dateFilter;
  }

  const pageNum = Math.max(1, Number(page ?? 1));
  const limitNum = Math.min(100, Math.max(1, Number(limit ?? 20)));

  const [transactions, total] = await Promise.all([
    TransactionModel.find(filter)
      .sort({ date: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("categoryId", "name kind color")
      .populate("accountId", "name type"),
    TransactionModel.countDocuments(filter),
  ]);

  res.json({
    transactions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { accountId, categoryId, type, amount, description, date } =
    req.body as Partial<CreateTransactionBody>;

  if (!accountId || !categoryId || !type || amount === undefined) {
    throw new AppError("Akun, kategori, jenis, dan jumlah wajib diisi", 400);
  }
  if (amount <= 0) {
    throw new AppError("Jumlah transaksi harus lebih besar dari 0", 400);
  }

  const transaction = await TransactionModel.create({
    userId,
    accountId,
    categoryId,
    type,
    amount,
    description: description ?? "",
    date: date ? new Date(date) : new Date(),
  });

  res.status(201).json({ transaction });
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { accountId, categoryId, type, amount, description, date } =
    req.body as Partial<CreateTransactionBody>;

  const transaction = await TransactionModel.findOne({ _id: id, userId });
  if (!transaction) {
    throw new AppError("Transaksi tidak ditemukan", 404);
  }

  if (accountId !== undefined) transaction.accountId = accountId as unknown as typeof transaction.accountId;
  if (categoryId !== undefined) transaction.categoryId = categoryId as unknown as typeof transaction.categoryId;
  if (type !== undefined) transaction.type = type;
  if (amount !== undefined) transaction.amount = amount;
  if (description !== undefined) transaction.description = description;
  if (date !== undefined) transaction.date = new Date(date);

  await transaction.save();
  res.json({ transaction });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  const transaction = await TransactionModel.findOneAndDelete({ _id: id, userId });
  if (!transaction) {
    throw new AppError("Transaksi tidak ditemukan", 404);
  }

  res.status(204).send();
});
