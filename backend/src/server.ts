import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import './types/express.d';

const app: Application = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Pastikan koneksi DB terbentuk (di-cache antar warm invocation oleh mongoose)
void connectDatabase();

// Hanya jalankan app.listen saat dev lokal — di Vercel, request ditangani
// lewat exported "app" di bawah, bukan lewat listener manual.
if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Berjalan di http://localhost:${env.port}`);
  });
}

export default app;
