import express from "express";
import userControllers from "../controllers/users";

const auth = require("../middleware/auth");

const router = express.Router();


// router.post('/signup', userControllers.signup);

router.post("/login", userControllers.login);
router.post("/", userControllers.createUser);
router.get("/", auth, userControllers.viewAllUsers);
router.get("/:id", auth, userControllers.getUserById);
router.patch("/:id", auth, userControllers.modifyUser);
router.delete("/:id", auth, userControllers.deleteUser);


export default router;
