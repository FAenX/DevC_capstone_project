import express from "express";
import articleControllers from "../controllers/articles";
import auth from "../middleware/auth";


const router = express.Router();

router.post("/", auth.verifyToken, articleControllers.createArticle);
router.get("/", auth.verifyToken, articleControllers.getAllArticles);
router.get("/:id", auth.verifyToken, articleControllers.getArticleById);
router.patch("/:id", auth.verifyToken, articleControllers.editArticle);
router.delete("/:id", auth.verifyToken, articleControllers.deleteArticle);

export default router;
