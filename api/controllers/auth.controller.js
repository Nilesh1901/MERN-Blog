import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/error.js";
import jwt from "jsonwebtoken";

// signUp route
export const signUp = wrapAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  // check if the user filled all the fields

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
  // hashig the password

  const hashPassword = bcryptjs.hashSync(password, 12);
  // add the new user to database

  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

  await newUser.save();
  res.json("new user saved!");
});

// sign in route
export const signIn = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if the user filled all the fields
  if (!email || !password) {
    return next(new ExpressError(400, "All fields are required"));
  }

  // validating user
  const validUser = await User.findOne({ email });
  if (!validUser) {
    return next(new ExpressError(404, "User not found"));
  }

  // validating password
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) {
    return next(new ExpressError(400, "Invalid Password"));
  }

  // assign token to the browser session with expiry in 7 days
  const token = jwt.sign(
    { userId: validUser._id, isAdmin: validUser.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Expires in 7 days
  );
  const { password: pass, ...rest } = validUser._doc;
  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    })
    .json(rest);
});

// google sign and signup requests
export const google = wrapAsync(async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  const user = await User.findOne({ email });

  // checking if the user is already existing in database
  if (user) {
    // assign token to the browser session
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json(rest);
  } else {
    // generating a random password
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashPassword = bcryptjs.hashSync(generatedPassword, 12);

    // adding the newuser to the database
    const newUser = new User({
      // creating a unique username
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashPassword,
      profilePicture: googlePhotoURL,
    });
    await newUser.save();

    // assign token to the browser session
    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password, ...rest } = newUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json(rest);
  }
});
