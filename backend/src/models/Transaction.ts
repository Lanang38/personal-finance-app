import { Schema, model, Document, Types } from 'mongoose';

export type TransactionType = 'income' | 'expense';

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  // Diisi HANYA kalau transaksi ini berasal dari kontribusi goal (lihat
  // goalController.contributeGoal). null untuk transaksi biasa.
  goalId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, default: '', trim: true },
    date: { type: Date, required: true, default: () => new Date() },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

transactionSchema.index({ userId: 1, date: -1 });

export const TransactionModel = model<ITransaction>(
  'Transaction',
  transactionSchema,
);
