import { Schema, model, Document, Types } from 'mongoose';

export interface IBudget extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  month: string; // format "YYYY-MM"
  limitAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
    limitAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

export const BudgetModel = model<IBudget>('Budget', budgetSchema);
