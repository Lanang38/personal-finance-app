import { Schema, model, Document, Types } from "mongoose";

export type CategoryKind = "income" | "expense";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  kind: CategoryKind;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    kind: { type: String, enum: ["income", "expense"], required: true },
    color: { type: String, default: "#5B21B6" },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
