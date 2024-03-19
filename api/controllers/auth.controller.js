import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import wrapAsync from "../utils/wrapAsync.js";
import ErrorHandler from "../utils/error.js";

export const signUp = wrapAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(new ErrorHandler(400, "All fields are required"));
  }

  const hashPassword = bcryptjs.hashSync(password, 12);

  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

  await newUser.save();
  res.json("new user saved!");
});
