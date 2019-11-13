import express from "express";
import gifControllers from "../controllers/gifs";

import auth from "../middleware/auth";
import { multerUploads } from "../middleware/multerUpload";
// import uploadToS3 from "../middleware/multer-config";

const router = express.Router();

router.post("/", auth.verifyToken, multerUploads, gifControllers.createGif);
router.patch("/:id", auth.verifyToken, gifControllers.patchGif);
router.get("/", gifControllers.getAllGifs);
router.get("/:id", gifControllers.getGif);
router.delete("/:id", auth.verifyToken, gifControllers.deleteGif);

export default router;
