import express from "express";
import feedControllers from "../controllers/feed";
import auth from "../middleware/auth";


const router = express.Router();

router.get("/", feedControllers.getFeed);

export default router;
