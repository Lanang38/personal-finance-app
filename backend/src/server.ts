import express, { Application } from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import apiRoutes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import "./types/express.d";

const app: Application = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap(): Promise<void> {
  await connectDatabase();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Berjalan di http://localhost:${env.port}`);
  });
}

void bootstrap();
