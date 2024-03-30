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
  const userUpdate = await User.findByIdAndUpdate(
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
  const { password, ...rest } = userUpdate._doc;
  res.status(200).json(rest);
});

export const deleteUser = wrapAsync(async (req, res, next) => {
  if (req.user.userId !== req.params.id) {
    return next(
      new ExpressError(403, "you are not allowed to delete this user ")
    );
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json("User deleted successfully");
});

export const signOut = wrapAsync(async (req, res, next) => {
  res.clearCookie("access_token").status(200).json("user has been signed out");
});

export const getUsers = wrapAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ExpressError(403, "You are not allowed to see all users"));
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  const users = await User.find()
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const usersWithoutPassword = users.map((user) => {
    const { password, ...rest } = user._doc;
    return rest;
  });
  const totalUsers = await User.countDocuments();
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    users: usersWithoutPassword,
    totalUsers,
    lastMonthUsers,
  });
});
