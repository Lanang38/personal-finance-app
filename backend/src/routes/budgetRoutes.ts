import { Router } from 'express';
import {
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  listAvailableMonths,
} from '../controllers/budgetController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/available-months', listAvailableMonths);
router.get('/', listBudgets);
router.post('/', createBudget);
router.patch('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
