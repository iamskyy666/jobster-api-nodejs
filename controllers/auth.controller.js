import { StatusCodes } from "http-status-codes";

import User from "../models/User.model.js";

import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  // Validate incoming data
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values!");
  }

  // Find currently authenticated user
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  // Update fields
  user.name = name;
  user.email = email;
  user.lastName = lastName;
  user.location = location;

  // Save updated document
  await user.save();

  // Generate a fresh JWT
  const token = user.createJWT();

  // User data to send back
  const userResponse = {
    name: user.name,
    email: user.email,
    lastName: user.lastName,
    location: user.location,
  };

  res.status(StatusCodes.OK).json({
    user: userResponse,
    token,
  });
};

export { register, login, updateUser };
