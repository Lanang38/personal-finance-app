import { Router } from "express";
import { exportTransactionsCsv } from "../controllers/exportController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.get("/transactions.csv", exportTransactionsCsv);

export default router;
