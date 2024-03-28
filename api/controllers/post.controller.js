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

export const getPosts = wrapAsync(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({ posts, totalPosts, lastMonthPosts });
});
