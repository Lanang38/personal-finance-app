import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Route ${req.originalUrl} tidak ditemukan` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: err.message || "Terjadi kesalahan pada server" });
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan yang tidak diketahui" });
}
