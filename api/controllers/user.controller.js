import User from "../models/user.model.js";
import ExpressError from "../utils/error.js";
import wrapAsync from "../utils/wrapAsync.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ msg: "api is working" });
};

export const updateUser = wrapAsync(async (req, res, next) => {
  if (req.user.userId !== req.params.id) {
    return next(
      new ExpressError(403, "You are not allowed to update this user")
    );
  }
  if (req.body.password) {
    if (req.body.password.length < 7) {
      return next(
        new ExpressError(400, "Password must be at least 8 characters")
      );
    }
    const hashedPassword = bcryptjs.hashSync(req.body.password, 12);
    req.body.password = hashedPassword;
  }
  if (req.body.username) {
    if (req.body.username.includes(" ")) {
      return next(new ExpressError(400, "Username cannot contain spaces"));
    } else if (req.body.username !== req.body.username.toLowerCase()) {
      return next(new ExpressError(400, "Username must be lowercase"));
    } else if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        new ExpressError(400, "Username must be between 7 and 20 characters")
      );
    } else if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        new ExpressError(400, "Username can only contain letters and numbers")
      );
    }
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        profilePicture: req.body.profilePicture,
        email: req.body.email,
      },
    },
    { new: true }
  );
  const { password, ...rest } = updateUser._doc;
  res.status(200).json(rest);
});
