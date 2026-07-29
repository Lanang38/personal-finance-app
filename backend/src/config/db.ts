import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongodbUri);
    // eslint-disable-next-line no-console
    console.log("[db] Terhubung ke MongoDB Atlas");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[db] Gagal terhubung ke MongoDB:", error);
    process.exit(1);
  }
}
