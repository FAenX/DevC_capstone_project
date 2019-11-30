import express from "express";
import {
  createComment, getAllComments, getCommentById, editComment, deleteComment,
} from "../controllers/comments";
import { verifyToken } from "../middleware/auth";


const router = express.Router();

router.post("/", verifyToken, createComment);
router.get("/", verifyToken, getAllComments);
router.get("/:id", verifyToken, getCommentById);
router.patch("/:id", verifyToken, editComment);
router.delete("/:id", verifyToken, deleteComment);

export default router;
