import express from "express";
import articleControllers from "../controllers/articles";


const router = express.Router();

router.post("/", articleControllers.createArticle);
router.get("/", articleControllers.getAllArticles);
router.get("/:id", articleControllers.getArticleById);
router.patch("/:id", articleControllers.editArticle);
router.delete("/:id", articleControllers.deleteArticle);

export default router;
