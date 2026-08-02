import { Router } from 'express';
import {
  getInsights,
  dismissSuggestion,
} from '../controllers/insightController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getInsights);
router.post('/dismiss', dismissSuggestion);

export default router;
