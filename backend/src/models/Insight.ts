import { Schema, model, Document, Types } from 'mongoose';

export interface IInsightSuggestion {
  conditionKey: string;
  text: string;
  action: { label: string; route: string } | null;
}

export interface IInsight extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  // Kapan insight ini terakhir digenerate oleh Gemini. Dipakai untuk cek
  // apakah cache masih "segar" (< 1 jam) atau perlu digenerate ulang.
  generatedAt: Date;
  widgetInsights: {
    expenseTrend: string;
    expenseByCategory: string;
    incomeByCategory: string;
    accounts: string;
  };
  suggestions: IInsightSuggestion[];
  affirmation: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const insightSchema = new Schema<IInsight>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // satu dokumen insight per user, di-refresh tiap 1 jam
      index: true,
    },
    generatedAt: { type: Date, required: true },
    widgetInsights: {
      expenseTrend: { type: String, default: '' },
      expenseByCategory: { type: String, default: '' },
      incomeByCategory: { type: String, default: '' },
      accounts: { type: String, default: '' },
    },
    suggestions: [
      {
        conditionKey: { type: String, required: true },
        text: { type: String, required: true },
        action: {
          label: { type: String },
          route: { type: String },
        },
      },
    ],
    affirmation: { type: String, default: null },
  },
  { timestamps: true },
);

export const InsightModel = model<IInsight>('Insight', insightSchema);
