import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
} from "../controllers/jobs.controller.js";
import testUserMiddleware from "../middleware/test-user.middleware.js";

const router = express.Router();

router.route("/").post(testUserMiddleware, createJob).get(getAllJobs);
router.route("/stats").get(showStats);

router
  .route("/:id")
  .get(getJob)
  .delete(testUserMiddleware, deleteJob)
  .patch(testUserMiddleware, updateJob);

export default router;
