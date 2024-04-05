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
    .populate("userId")
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

export const deletePost = wrapAsync(async (req, res, next) => {
  if (!req.user.isAdmin && req.params.userId !== req.user.userId) {
    return next(
      new ExpressError(403, "You are not allowed to delete this post")
    );
  }
  await Post.findByIdAndDelete(req.params.postId);
  res.status(200).json("Post has been deleted");
});

export const updatePost = wrapAsync(async (req, res, next) => {
  if (!req.user.isAdmin && req.user.userId !== req.params.userId) {
    return next(new ExpressError(403, "You are not allowed to Edit this post"));
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: {
        title: req.body.title,
        category: req.body.category,
        image: req.body.image,
        content: req.body.content,
      },
    },
    { new: true }
  );
  res.status(200).json(updatedPost);
});
