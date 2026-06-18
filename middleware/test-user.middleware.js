import BadRequestError from "../errors/bad-request.js";

const testUserMiddleware = (req, res, next) => {
  //
  if (req.user.testUser) {
    throw new BadRequestError("Test User. Read Only!");
  }
  next();
};

export default testUserMiddleware;
