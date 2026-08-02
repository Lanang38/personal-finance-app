import { Types } from 'mongoose';
import { TransactionModel } from '../models/Transaction';
import { CategoryModel } from '../models/Category';
import { BudgetModel } from '../models/Budget';
import { GoalModel } from '../models/Goal';
import { AccountModel } from '../models/Account';
import { DismissedSuggestionModel } from '../models/DismissedSuggestion';

// ==== Ambang batas rule (mudah disesuaikan tanpa ubah logic) ====
const GOAL_DEADLINE_DAYS = 14;
const GOAL_DEADLINE_MAX_PERCENTAGE = 80;
const ACCOUNT_IDLE_DAYS = 30;
const ACCOUNT_IDLE_SHARE_THRESHOLD = 0.3; // akun dianggap "dominan" kalau >=30% dari total saldo

export interface SuggestionCandidate {
  conditionKey: string;
  summary: string; // fakta mentah untuk diolah Gemini jadi kalimat
  action: { label: string; route: string } | null;
}

export interface InsightFacts {
  totalExpenseThisMonth: number;
  totalExpenseLastMonth: number;
  totalIncomeThisMonth: number;
  topExpenseCategory: {
    name: string;
    total: number;
    sharePercent: number;
  } | null;
  topIncomeCategory: {
    name: string;
    total: number;
    sharePercent: number;
  } | null;
  largestAccount: {
    name: string;
    balance: number;
    sharePercent: number;
  } | null;
}

interface PopulatedCategoryRef {
  _id: Types.ObjectId;
  name: string;
}

function currentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
  };
}

function lastMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
  };
}

function daysBetween(a: Date, b: Date): number {
  const clone = (d: Date) => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
  };
  return Math.round(
    (clone(a).getTime() - clone(b).getTime()) / (1000 * 60 * 60 * 24),
  );
}

export async function buildInsightData(
  userId: string,
): Promise<{ facts: InsightFacts; candidates: SuggestionCandidate[] }> {
  const objectId = new Types.ObjectId(userId);
  const { start: thisStart, end: thisEnd } = currentMonthRange();
  const { start: lastStart, end: lastEnd } = lastMonthRange();

  const [
    thisMonthExpenseByCategory,
    lastMonthExpenseAgg,
    thisMonthIncomeByCategory,
    expenseCategories,
    incomeCategories,
    budgets,
    goals,
    accountsRaw,
    dismissed,
  ] = await Promise.all([
    TransactionModel.aggregate<{ _id: Types.ObjectId; total: number }>([
      {
        $match: {
          userId: objectId,
          type: 'expense',
          date: { $gte: thisStart, $lte: thisEnd },
        },
      },
      { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
    ]),
    TransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          userId: objectId,
          type: 'expense',
          date: { $gte: lastStart, $lte: lastEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    TransactionModel.aggregate<{ _id: Types.ObjectId; total: number }>([
      {
        $match: {
          userId: objectId,
          type: 'income',
          date: { $gte: thisStart, $lte: thisEnd },
        },
      },
      { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
    ]),
    CategoryModel.find({ userId, kind: 'expense' }),
    CategoryModel.find({ userId, kind: 'income' }),
    BudgetModel.find({ userId }).populate<{ categoryId: PopulatedCategoryRef }>(
      'categoryId',
    ),
    GoalModel.find({ userId }),
    AccountModel.find({ userId }),
    DismissedSuggestionModel.find({ userId }),
  ]);

  const dismissedKeys = new Set(dismissed.map((d) => d.conditionKey));
  const expenseCategoryMap = new Map(
    expenseCategories.map((c) => [String(c._id), c.name]),
  );
  const incomeCategoryMap = new Map(
    incomeCategories.map((c) => [String(c._id), c.name]),
  );

  // ---------- Facts (untuk caption widget) ----------
  const totalExpenseThisMonth = thisMonthExpenseByCategory.reduce(
    (sum, c) => sum + c.total,
    0,
  );
  const totalExpenseLastMonth = lastMonthExpenseAgg[0]?.total ?? 0;
  const totalIncomeThisMonth = thisMonthIncomeByCategory.reduce(
    (sum, c) => sum + c.total,
    0,
  );

  const topExpenseRaw = [...thisMonthExpenseByCategory].sort(
    (a, b) => b.total - a.total,
  )[0];
  const topExpenseCategory = topExpenseRaw
    ? {
        name: expenseCategoryMap.get(String(topExpenseRaw._id)) ?? 'Lainnya',
        total: topExpenseRaw.total,
        sharePercent:
          totalExpenseThisMonth > 0
            ? Math.round((topExpenseRaw.total / totalExpenseThisMonth) * 100)
            : 0,
      }
    : null;

  const topIncomeRaw = [...thisMonthIncomeByCategory].sort(
    (a, b) => b.total - a.total,
  )[0];
  const topIncomeCategory = topIncomeRaw
    ? {
        name: incomeCategoryMap.get(String(topIncomeRaw._id)) ?? 'Lainnya',
        total: topIncomeRaw.total,
        sharePercent:
          totalIncomeThisMonth > 0
            ? Math.round((topIncomeRaw.total / totalIncomeThisMonth) * 100)
            : 0,
      }
    : null;

  // Saldo per akun = initialBalance + income - expense (sepanjang waktu, bukan cuma bulan ini)
  const accountBalances = await Promise.all(
    accountsRaw.map(async (account) => {
      const [incomeAgg, expenseAgg, lastTx] = await Promise.all([
        TransactionModel.aggregate<{ total: number }>([
          { $match: { accountId: account._id, type: 'income' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        TransactionModel.aggregate<{ total: number }>([
          { $match: { accountId: account._id, type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        TransactionModel.findOne({ accountId: account._id }).sort({ date: -1 }),
      ]);

      const balance =
        account.initialBalance +
        (incomeAgg[0]?.total ?? 0) -
        (expenseAgg[0]?.total ?? 0);
      const daysSinceLastTx = lastTx
        ? daysBetween(new Date(), lastTx.date)
        : Infinity;

      return {
        id: String(account._id),
        name: account.name,
        balance,
        daysSinceLastTx,
      };
    }),
  );

  const totalBalance = accountBalances.reduce((sum, a) => sum + a.balance, 0);
  const largestAccountRaw = [...accountBalances].sort(
    (a, b) => b.balance - a.balance,
  )[0];
  const largestAccount =
    largestAccountRaw && totalBalance > 0
      ? {
          name: largestAccountRaw.name,
          balance: largestAccountRaw.balance,
          sharePercent: Math.round(
            (largestAccountRaw.balance / totalBalance) * 100,
          ),
        }
      : null;

  const facts: InsightFacts = {
    totalExpenseThisMonth,
    totalExpenseLastMonth,
    totalIncomeThisMonth,
    topExpenseCategory,
    topIncomeCategory,
    largestAccount,
  };

  // ---------- Rule 1: kategori sudah ada pengeluaran, belum punya anggaran ----------
  const candidates: SuggestionCandidate[] = [];
  const budgetedCategoryIds = new Set(
    budgets.map((b) => String(b.categoryId?._id ?? b.categoryId)),
  );

  for (const cat of thisMonthExpenseByCategory) {
    const categoryId = String(cat._id);
    if (budgetedCategoryIds.has(categoryId)) continue;

    const key = `budget_missing:${categoryId}`;
    if (dismissedKeys.has(key)) continue;

    candidates.push({
      conditionKey: key,
      summary: `Kategori "${expenseCategoryMap.get(categoryId) ?? 'ini'}" sudah menghabiskan Rp${cat.total.toLocaleString('id-ID')} bulan ini tapi belum punya anggaran.`,
      action: { label: 'Atur anggaran', route: '/budgets' },
    });
  }

  // ---------- Rule 2: anggaran yang sudah terlampaui ----------
  for (const budget of budgets) {
    if (budget.limitAmount <= 0) continue;

    const categoryId = String(budget.categoryId?._id ?? budget.categoryId);
    const spent =
      thisMonthExpenseByCategory.find((c) => String(c._id) === categoryId)
        ?.total ?? 0;
    if (spent < budget.limitAmount) continue;

    const key = `budget_exceeded:${String(budget._id)}`;
    if (dismissedKeys.has(key)) continue;

    const categoryName = budget.categoryId?.name ?? 'kategori ini';
    candidates.push({
      conditionKey: key,
      summary: `Anggaran "${categoryName}" sudah terlampaui: Rp${spent.toLocaleString('id-ID')} dari limit Rp${budget.limitAmount.toLocaleString('id-ID')}.`,
      action: { label: 'Tinjau anggaran', route: '/budgets' },
    });
  }

  // ---------- Rule 3: target tabungan mendekati deadline, progress masih rendah ----------
  const now = new Date();
  for (const goal of goals) {
    if (goal.currentAmount >= goal.targetAmount) continue;
    if (!goal.targetDate) continue;

    const daysLeft = daysBetween(goal.targetDate, now);
    if (daysLeft < 0 || daysLeft > GOAL_DEADLINE_DAYS) continue;

    const percentage = Math.round(
      (goal.currentAmount / goal.targetAmount) * 100,
    );
    if (percentage >= GOAL_DEADLINE_MAX_PERCENTAGE) continue;

    const key = `goal_deadline:${String(goal._id)}`;
    if (dismissedKeys.has(key)) continue;

    candidates.push({
      conditionKey: key,
      summary: `Target "${goal.name}" tinggal ${daysLeft} hari, progress baru ${percentage}%.`,
      action: { label: 'Tambah kontribusi', route: '/goals' },
    });
  }

  // ---------- Rule 4: saldo menumpuk di satu akun tanpa aktivitas, padahal ada target aktif ----------
  const hasActiveGoal = goals.some((g) => g.currentAmount < g.targetAmount);
  if (hasActiveGoal && totalBalance > 0) {
    for (const acc of accountBalances) {
      if (acc.balance <= 0) continue;
      if (acc.daysSinceLastTx < ACCOUNT_IDLE_DAYS) continue;

      const share = acc.balance / totalBalance;
      if (share < ACCOUNT_IDLE_SHARE_THRESHOLD) continue;

      const key = `account_idle:${acc.id}`;
      if (dismissedKeys.has(key)) continue;

      candidates.push({
        conditionKey: key,
        summary: `Saldo di akun "${acc.name}" (Rp${acc.balance.toLocaleString('id-ID')}) sudah tidak ada transaksi lebih dari ${ACCOUNT_IDLE_DAYS} hari.`,
        action: { label: 'Alokasikan ke target', route: '/goals' },
      });
    }
  }

  return { facts, candidates };
}
