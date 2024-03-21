import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/error.js";
import jwt from "jsonwebtoken";

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
    return next(new ExpressError(400, "All fields are required"));
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

export const signIn = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ExpressError(400, "All fields are required"));
  }
  const validUser = await User.findOne({ email });
  if (!validUser) {
    return next(new ExpressError(404, "User not found"));
  }
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) {
    return next(new ExpressError(400, "Invalid Password"));
  }

  const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET);
  const { password: pass, ...rest } = validUser._doc;
  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json(rest);
});
