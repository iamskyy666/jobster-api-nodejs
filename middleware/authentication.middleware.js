import jwt from "jsonwebtoken";

import UnauthenticatedError from "../errors/unauthenticated.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user to the job routes
    const testUser = payload.userId === "6a33b721bcd2294df31b9856"; // demo/test user _id
    req.user = {
      userId: payload.userId,
      testUser,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export default authMiddleware;
