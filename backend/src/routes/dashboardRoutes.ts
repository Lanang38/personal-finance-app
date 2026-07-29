import { Router } from "express";
import { getSummary } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.get("/summary", getSummary);

export default router;
