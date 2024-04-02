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
  });
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
