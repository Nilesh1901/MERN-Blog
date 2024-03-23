import jwt from "jsonwebtoken";
import ExpressError from "./error.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(new ExpressError(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new ExpressError(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
