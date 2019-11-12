import express from "express";
import articleControllers from "../controllers/articles";


const router = express.Router();

router.post("/", articleControllers.createArticle);
router.get("/", articleControllers.getAllArticle);
router.get("/:id", articleControllers.getArticleById);

export default router;
