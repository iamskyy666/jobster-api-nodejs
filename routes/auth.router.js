import express from "express";

import { register, login, updateUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authentication.middleware.js";
import testUserMiddleware from "../middleware/test-user.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.patch("/updateUser", authMiddleware,testUserMiddleware, updateUser);

export default router;
