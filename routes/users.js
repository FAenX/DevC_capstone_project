import express from "express";
import userControllers from "../controllers/users";

import auth from "../middleware/auth";

const router = express.Router();


// user routes
router.post("/token", userControllers.token);

/**
 * @swagger
 * definition:
 *   users:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/users'
 */
router.post("/", auth.isStaff, userControllers.createUser);
router.get("/", auth.verifyToken, userControllers.viewAllUsers);
router.get("/:id", auth.verifyToken, userControllers.getUserById);
router.patch("/:id", auth.verifyToken, userControllers.modifyUser);
router.delete("/:id", auth.verifyToken, userControllers.deleteUser);


export default router;
