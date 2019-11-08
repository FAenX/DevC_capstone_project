import express from "express";
import gifControllers from "../controllers/gifs";

import auth from "../middleware/auth";
import multer from "../middleware/multer-config";

const router = express.Router();

// gifs
router.post("/", multer, gifControllers.createGif);
router.patch("/:id", gifControllers.patchGif);
router.get("/", gifControllers.getAllGifs);
router.get("/:id", gifControllers.getGif);
router.delete("/:id", gifControllers.deleteGif);

export default router;
