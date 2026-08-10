import mongoose from 'mongoose';
import { env } from './env';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongodbUri);
    // eslint-disable-next-line no-console
    console.log('[db] Terhubung ke MongoDB Atlas');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] Gagal terhubung ke MongoDB:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
}
