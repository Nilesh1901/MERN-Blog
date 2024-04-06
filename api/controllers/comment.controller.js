import { response } from "express";
import Comment from "../models/comment.model.js";
import ExpressError from "../utils/error.js";
import wrapAsync from "../utils/wrapAsync.js";

export const createComment = wrapAsync(async (req, res, next) => {
  const { postId, userId, content } = req.body;
  if (req.user.userId !== userId) {
    return next(new ExpressError(403, "You are not allowed to make comment"));
  }
  const newComment = new Comment({
    content,
    postId,
    userId,
  });

  await newComment.save();
  res.status(200).json(newComment);
});

export const getPostComments = wrapAsync(async (req, res, next) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  }).populate('userId').populate('postId');
  res.status(200).json(comments);
});

export const likeComment = wrapAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new ExpressError(404, "comment dose not found"));
  }
  const userIndex = comment.likes.indexOf(req.user.userId);
  if (userIndex === -1) {
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.userId);
  } else {
    comment.numberOfLikes -= 1;
    comment.likes.splice(userIndex, 1);
  }
  await comment.save();
  res.status(200).json(comment);
});

export const editComment = wrapAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new ExpressError(404, "comment dose not found"));
  }
  if (req.user.userId !== comment.userId && !req.user.isAdmin) {
    return next(
      new ExpressError(403, "You are not allowed to edit this comment")
    );
  }
  const editedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      content: req.body.content,
    },
    { new: true }
  );
  await editedComment.save();
  res.status(200).json(editedComment);
});

export const deleteComment = wrapAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new ExpressError(404, "Comment not found"));
  }
  if (comment.userId !== req.user.userId && !req.user.isAdmin) {
    return next(
      new ExpressError(403, "You are not allowed to deleted this comment")
    );
  }
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json("Comment has been deleted");
});

export const getComment = wrapAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new ExpressError(403, "You are not allowed to get all Comments")
    );
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  const comments = await Comment.find()
    .populate({
      path: "postId",
    })
    .populate({
      path: "userId",
    })
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComments = await Comment.countDocuments();
  const now = new Date();
  const oneMothAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMothAgo },
  });
  res.status(200).json({
    comments,
    totalComments,
    lastMonthComments,
  });
});
