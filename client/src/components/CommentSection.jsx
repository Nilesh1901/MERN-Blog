import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((store) => store.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
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
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
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
    </div>
  );
}

export default CommentSection;
