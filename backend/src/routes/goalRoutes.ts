import { Router } from 'express';
import {
  listGoals,
  createGoal,
  updateGoal,
  contributeGoal,
  deleteGoal,
} from '../controllers/goalController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', listGoals);
router.post('/', createGoal);
router.patch('/:id', updateGoal);
router.post('/:id/contribute', contributeGoal);
router.delete('/:id', deleteGoal);

export default router;
