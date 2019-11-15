import express from "express";
import userControllers from "../controllers/users";

import auth from "../middleware/auth";

const router = express.Router();


// user routes
router.post("/create-user", auth.isStaff, userControllers.createUser);
router.post("/signin", userControllers.token);
router.get("/", auth.isStaff, userControllers.viewAllUsers);
router.get("/:id", auth.verifyToken, userControllers.getUserById);
router.patch("/:id", auth.verifyToken, userControllers.modifyUser);
router.delete("/:id", auth.verifyToken, userControllers.deleteUser);


export default router;
