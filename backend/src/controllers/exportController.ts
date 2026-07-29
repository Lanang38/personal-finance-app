import { Request, Response } from "express";
import { TransactionModel } from "../models/Transaction";
import { asyncHandler } from "../utils/asyncHandler";

interface CategoryLean {
  name: string;
}
interface AccountLean {
  name: string;
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export const exportTransactionsCsv = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const transactions = await TransactionModel.find({ userId })
    .sort({ date: -1 })
    .populate("categoryId", "name")
    .populate("accountId", "name");

  const header = ["Tanggal", "Akun", "Kategori", "Jenis", "Jumlah", "Deskripsi"];
  const rows = transactions.map((tx) => {
    const category = tx.categoryId as unknown as CategoryLean | null;
    const account = tx.accountId as unknown as AccountLean | null;
    return [
      tx.date.toISOString().slice(0, 10),
      account?.name ?? "-",
      category?.name ?? "-",
      tx.type === "income" ? "Pemasukan" : "Pengeluaran",
      String(tx.amount),
      tx.description ?? "",
    ]
      .map(escapeCsvField)
      .join(",");
  });

  const csvContent = [header.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="transaksi-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  res.status(200).send(csvContent);
});
