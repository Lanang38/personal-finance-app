import { Request, Response } from "express";
import { AccountModel, AccountType } from "../models/Account";
import { TransactionModel } from "../models/Transaction";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

interface CreateAccountBody {
  name: string;
  type: AccountType;
  currency?: string;
  initialBalance?: number;
}

export const listAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const accounts = await AccountModel.find({ userId }).sort({ createdAt: 1 });

  const accountsWithBalance = await Promise.all(
    accounts.map(async (account) => {
      const [incomeAgg, expenseAgg] = await Promise.all([
        TransactionModel.aggregate<{ total: number }>([
          { $match: { accountId: account._id, type: "income" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        TransactionModel.aggregate<{ total: number }>([
          { $match: { accountId: account._id, type: "expense" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      const income = incomeAgg[0]?.total ?? 0;
      const expense = expenseAgg[0]?.total ?? 0;
      const balance = account.initialBalance + income - expense;

      return {
        id: String(account._id),
        name: account.name,
        type: account.type,
        currency: account.currency,
        initialBalance: account.initialBalance,
        balance,
      };
    })
  );

  res.json({ accounts: accountsWithBalance });
});

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { name, type, currency, initialBalance } = req.body as Partial<CreateAccountBody>;

  if (!name || !type) {
    throw new AppError("Nama dan tipe akun wajib diisi", 400);
  }

  const account = await AccountModel.create({
    userId,
    name,
    type,
    currency: currency ?? "IDR",
    initialBalance: initialBalance ?? 0,
  });

  res.status(201).json({
    account: {
      id: String(account._id),
      name: account.name,
      type: account.type,
      currency: account.currency,
      initialBalance: account.initialBalance,
      balance: account.initialBalance,
    },
  });
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { name, type, currency, initialBalance } = req.body as Partial<CreateAccountBody>;

  const account = await AccountModel.findOne({ _id: id, userId });
  if (!account) {
    throw new AppError("Akun tidak ditemukan", 404);
  }

  if (name !== undefined) account.name = name;
  if (type !== undefined) account.type = type;
  if (currency !== undefined) account.currency = currency;
  if (initialBalance !== undefined) account.initialBalance = initialBalance;

  await account.save();
  res.json({
    account: {
      id: String(account._id),
      name: account.name,
      type: account.type,
      currency: account.currency,
      initialBalance: account.initialBalance,
    },
  });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  const account = await AccountModel.findOneAndDelete({ _id: id, userId });
  if (!account) {
    throw new AppError("Akun tidak ditemukan", 404);
  }

  await TransactionModel.deleteMany({ accountId: account._id, userId });
  res.status(204).send();
});
