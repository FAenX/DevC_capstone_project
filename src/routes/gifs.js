import express from "express";
import multer from "multer";
import gifControllers from "../controllers/gifs";

import auth from "../middleware/auth";


const storage = multer.memoryStorage({
  filename(req, file, callback) {
    callback(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage }).single("file");

const router = express.Router();

router.post("/", auth.verifyToken, upload, gifControllers.createGif);
router.get("/", auth.verifyToken, gifControllers.getAllGifs);
router.get("/:id", auth.verifyToken, gifControllers.getGif);
router.delete("/:id", auth.verifyToken, gifControllers.deleteGif);

export default router;
