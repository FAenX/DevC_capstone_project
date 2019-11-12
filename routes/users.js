import express from "express";
import userControllers from "../controllers/users";

import auth from "../middleware/auth";

const router = express.Router();


// user routes
router.post("/token", userControllers.token);


router.post("/", auth.isStaff, userControllers.createUser);
router.get("/", auth.verifyToken, userControllers.viewAllUsers);
router.get("/:id", auth.verifyToken, userControllers.getUserById);
router.patch("/:id", auth.verifyToken, userControllers.modifyUser);
router.delete("/:id", auth.verifyToken, userControllers.deleteUser);


export default router;
