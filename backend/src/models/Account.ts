import { Schema, model, Document, Types } from "mongoose";

export type AccountType = "cash" | "bank" | "e-wallet" | "other";

export interface IAccount extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["cash", "bank", "e-wallet", "other"],
      default: "cash",
    },
    currency: { type: String, default: "IDR" },
    initialBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AccountModel = model<IAccount>("Account", accountSchema);
