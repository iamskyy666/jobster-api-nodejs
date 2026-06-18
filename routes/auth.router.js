import express from "express";

import { register, login, updateUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authentication.middleware.js";
import testUserMiddleware from "../middleware/test-user.middleware.js";
import { rateLimit } from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

const router = express.Router();

router.post("/register", apiLimiter, register);

router.post("/login", apiLimiter, login);

router.patch("/updateUser", authMiddleware, testUserMiddleware, updateUser);

export default router;
