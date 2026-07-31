import { Router } from "express";
import {
  listCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.get("/", listCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;
