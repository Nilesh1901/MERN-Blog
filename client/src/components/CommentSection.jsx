import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comments from "./Comments";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((store) => store.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    try {
      if (comment.length > 200) {
        return;
      }
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setCommentError(data.message);
      } else {
        setComment("");
        setPostComments([data, ...postComments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetch(`/api/comment/getPostComments/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPostComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);
  return (
    <div className="max-w-2xl mx-auto w-full p-3 border-t border-slate-500">
      {currentUser ? (
        <div className="flex w-full gap-1 items-center text-sm my-5 text-gray-500 dark:text-zinc-400">
          <p>signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="h-5 w-5 rounded-full object-cover"
          />
          <Link
            className=" text-cyan-600 hover:underline text-xs"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border p-3 border-teal-500 rounded-md"
        >
          <Textarea
            placeholder="Add a comment.."
            maxLength="200"
            rows="4"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs text-gray-400">
              {200 - comment.length} characters remaning
            </p>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
          {commentError && <Alert color="failure">{commentError}</Alert>}
        </form>
      )}
      {postComments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{postComments.length}</p>
            </div>
          </div>
          {postComments.map((postComment) => (
            <Comments key={postComment._id} comment={postComment} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
