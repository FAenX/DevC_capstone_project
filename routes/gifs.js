import express from "express";
import gifControllers from "../controllers/gifs";

// import auth from "../middleware/auth";
import { multerUploads } from "../middleware/multerUpload";
// import uploadToS3 from "../middleware/multer-config";

const router = express.Router();

// gifs
router.post("/", multerUploads, gifControllers.createGif);
router.patch("/:id", gifControllers.patchGif);
router.get("/", gifControllers.getAllGifs);
router.get("/:id", gifControllers.getGif);
router.delete("/:id", gifControllers.deleteGif);

export default router;
