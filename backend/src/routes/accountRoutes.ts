import { Router } from "express";
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.get("/", listAccounts);
router.post("/", createAccount);
router.patch("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;
