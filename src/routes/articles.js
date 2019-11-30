import express from "express";
import {
  getAllArticles, createArticle, getArticleById, editArticle, deleteArticle,
} from "../controllers/articles";
import { verifyToken } from "../middleware/auth";


const router = express.Router();

router.post("/", verifyToken, createArticle);
router.get("/", verifyToken, getAllArticles);
router.get("/:id", verifyToken, getArticleById);
router.patch("/:id", verifyToken, editArticle);
router.delete("/:id", verifyToken, deleteArticle);

export default router;
