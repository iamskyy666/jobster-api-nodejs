import "dotenv/config";

import express from "express";
import helmet from "helmet";

import authRouter from "./routes/auth.router.js";
import jobsRouter from "./routes/jobs.router.js";


import authMiddleware from "./middleware/authentication.middleware.js";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorHandlerMiddleware from "./middleware/error-handler.middleware.js";
import connectDB from "./db/connect.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// For deployment
app.set("trust proxy", 1);

// Core Middleware
app.use(express.json());

// Security Middleware
app.use(helmet());

// Home Route
app.get("/", (_, res) => {
  res.send(`
    <h1>Jobs API 🚀</h1>
    <p>REST API for managing job applications.</p>
  `);
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

// Serve React static files
app.use(express.static(path.resolve(__dirname, "./client/build")));

// Catch all frontend routes
app.get("/*splat", (_, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Error Handling Middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server Startup
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);
    process.exit(1);
  }
};

start();
