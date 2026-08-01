import { Request, Response } from 'express';
import { GoalModel } from '../models/Goal';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

interface CreateGoalBody {
  name: string;
  targetAmount: number;
  targetDate?: string | null;
}

interface UpdateGoalBody {
  name?: string;
  targetAmount?: number;
  targetDate?: string | null;
}

function serializeGoal(goal: {
  _id: unknown;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date | null;
}) {
  const percentage =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round((goal.currentAmount / goal.targetAmount) * 100),
        )
      : 0;

  return {
    id: String(goal._id),
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    targetDate: goal.targetDate
      ? goal.targetDate.toISOString().slice(0, 10)
      : null,
    percentage,
    isCompleted: goal.currentAmount >= goal.targetAmount,
  };
}

export const listGoals = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const goals = await GoalModel.find({ userId }).sort({ createdAt: -1 });

  res.json({ goals: goals.map(serializeGoal) });
});

export const createGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { name, targetAmount, targetDate } =
    req.body as Partial<CreateGoalBody>;

  if (!name || !targetAmount || targetAmount <= 0) {
    throw new AppError('Nama dan target nominal wajib diisi dengan benar', 400);
  }

  const goal = await GoalModel.create({
    userId,
    name,
    targetAmount,
    currentAmount: 0,
    targetDate: targetDate ? new Date(targetDate) : null,
  });

  res.status(201).json({ goal: serializeGoal(goal) });
});

export const updateGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { name, targetAmount, targetDate } = req.body as UpdateGoalBody;

  const goal = await GoalModel.findOne({ _id: id, userId });
  if (!goal) {
    throw new AppError('Target tabungan tidak ditemukan', 404);
  }

  if (name !== undefined) goal.name = name;
  if (targetAmount !== undefined) {
    if (targetAmount <= 0) {
      throw new AppError('Target nominal harus lebih besar dari 0', 400);
    }
    goal.targetAmount = targetAmount;
  }
  if (targetDate !== undefined) {
    goal.targetDate = targetDate ? new Date(targetDate) : null;
  }

  await goal.save();
  res.json({ goal: serializeGoal(goal) });
});

export const contributeGoal = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { amount } = req.body as { amount?: number };

    if (!amount || amount <= 0) {
      throw new AppError('Nominal kontribusi harus lebih besar dari 0', 400);
    }

    const goal = await GoalModel.findOne({ _id: id, userId });
    if (!goal) {
      throw new AppError('Target tabungan tidak ditemukan', 404);
    }

    goal.currentAmount += amount;
    await goal.save();

    res.json({ goal: serializeGoal(goal) });
  },
);

export const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  const goal = await GoalModel.findOneAndDelete({ _id: id, userId });
  if (!goal) {
    throw new AppError('Target tabungan tidak ditemukan', 404);
  }

  res.status(204).send();
});
