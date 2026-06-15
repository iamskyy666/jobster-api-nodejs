import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";


import authRouter from "./routes/auth.router.js";
import jobsRouter from "./routes/jobs.router.js";

import authMiddleware from "./middleware/authentication.middleware.js";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorHandlerMiddleware from "./middleware/error-handler.middleware.js";
import connectDB from "./db/connect.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Swagger Documentation
|--------------------------------------------------------------------------
*/
const swaggerDocument = YAML.load("./swagger.yaml");

/*
|--------------------------------------------------------------------------
| Trust Proxy
|--------------------------------------------------------------------------
|
| Required for deployment platforms like Render, Railway, Heroku, etc.
| Allows Express to correctly identify the client's IP address.
|
*/
app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Core Middleware
|--------------------------------------------------------------------------
*/
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(helmet());
app.use(cors());

/*
|--------------------------------------------------------------------------
| Home Route
|--------------------------------------------------------------------------
*/
app.get("/", (_, res) => {
  res.send(`
    <h1>Jobs API 🚀</h1>
    <p>REST API for managing job applications.</p>
    <a href="/api-docs">View API Documentation</a>
  `);
});

/*
|--------------------------------------------------------------------------
| Swagger Documentation Route
|--------------------------------------------------------------------------
*/
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/jobs", authMiddleware, jobsRouter);

/*
|--------------------------------------------------------------------------
| Error Handling Middleware
|--------------------------------------------------------------------------
*/
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

/*
|--------------------------------------------------------------------------
| Server Startup
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    //  if (!process.env.MONGO_URI) {
    //    throw new Error("MONGO_URI is missing in .env");
    //  }
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);
    process.exit(1);
  }
};

start();
