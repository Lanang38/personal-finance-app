import { Router } from 'express';
import { scanReceipt } from '../controllers/receiptController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/scan', scanReceipt);

export default router;
