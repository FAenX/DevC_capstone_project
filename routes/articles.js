import express from "express";
import articleControllers from "../controllers/articles";


const router = express.Router();

router.post("/", articleControllers.createArticle);

export default router;
