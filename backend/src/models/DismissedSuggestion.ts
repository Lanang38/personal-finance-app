import { Schema, model, Document, Types } from 'mongoose';

export interface IDismissedSuggestion extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  conditionKey: string;
  createdAt: Date;
}

const dismissedSuggestionSchema = new Schema<IDismissedSuggestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    conditionKey: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

dismissedSuggestionSchema.index(
  { userId: 1, conditionKey: 1 },
  { unique: true },
);

export const DismissedSuggestionModel = model<IDismissedSuggestion>(
  'DismissedSuggestion',
  dismissedSuggestionSchema,
);