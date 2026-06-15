import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
} from "../controllers/jobs.controller.js";

const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);

router.route("/:id").get(getJob).delete(deleteJob).patch(updateJob);

export default router;
