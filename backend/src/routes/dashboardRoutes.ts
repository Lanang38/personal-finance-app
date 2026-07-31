import { Router } from 'express';
import {
  getSummary,
  getAvailablePeriods,
} from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/available-periods', getAvailablePeriods);

export default router;
