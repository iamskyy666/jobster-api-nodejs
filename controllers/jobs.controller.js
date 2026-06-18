import { StatusCodes } from "http-status-codes";

import Job from "../models/Job.model.js";

import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";

import moment from "moment";
import mongoose from "mongoose";

const getAllJobs = async (req, res) => {
  // search-params (search-bar)
  const { search, status, jobType, sort } = req.query;

  const queryObj = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObj.position = { $regex: search, $options: "i" };
  }

  // status and JobType (dropdowns)
  if (status && status !== "all") {
    queryObj.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObj.jobType = jobType;
  }

  let result = Job.find(queryObj);

  // chain sort conditions (dropdowns)
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObj); // total 40 jobs
  const numOfPages = Math.ceil(totalJobs / limit); // 40/8 = 5

  res.status(StatusCodes.OK).json({
    jobs,
    totalJobs,
    numOfPages,
  });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    job,
  });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({
    job,
  });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    job,
  });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
   // console.log(stats);
  // [{ _id: 'declined', count: 1 },{ _id: 'pending', count: 20 },{ _id: 'interview', count: 19 }]

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

   const defaultStats = {
     pending: stats.pending || 0,
     interview: stats.interview || 0,
     declined: stats.declined || 0,
   }; 
  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyApplications: [] });
};

export { createJob, deleteJob, getAllJobs, updateJob, getJob, showStats };
