import { Router } from 'express';
import {
  updateProfile,
  updateAvatar,
  changePassword,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.patch('/me/profile', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.patch('/me/password', changePassword);

export default router;
