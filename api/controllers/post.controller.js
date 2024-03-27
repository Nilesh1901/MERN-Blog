import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = wrapAsync(async (req, res, next) => {
  // checking if the user is Admin
  if (!req.user.isAdmin) {
    return next(new ExpressError(403, "You are not allowed to create a post"));
  }

  // checking the required fields
  if (!req.body.title && !req.body.content) {
    return next(new ExpressError(400, "Please provide all required fields"));
  }

  // creating slug
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  // creating new post
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.userId,
  });

  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
});
