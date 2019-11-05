import express from "express";
import gifControllers from "../controllers/gifs";

import auth from "../middleware/auth";
import multer from "../middleware/multer-config";

const router = express.Router();

// gifs
router.post("/", multer, gifControllers.createGif);
router.patch("/:id", auth.verifyToken, gifControllers.patchGif);
router.get("/", auth.verifyToken, gifControllers.getAllGifs);
router.get("/:id", auth.verifyToken, gifControllers.getGif);
router.delete("/:id", auth.verifyToken, gifControllers.deleteGif);

export default router;
