import { Schema, model, Document, Types } from 'mongoose';

export interface IGoal extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 1 },
    currentAmount: { type: Number, default: 0, min: 0 },
    targetDate: { type: Date, default: null },
  },
  { timestamps: true },
);

export const GoalModel = model<IGoal>('Goal', goalSchema);
