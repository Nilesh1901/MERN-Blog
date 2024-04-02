import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Comments({ comment, onLike }) {
  const { currentUser } = useSelector((store) => store.user);
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`);
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="mr-3 flex-shrink-0">
        <img
          className="w-10 h-10 rounded-full bg-gray-400"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className=" text-xs mr-1 truncate font-bold">
            {user ? `@${user.username}` : "anonymos user"}
          </span>
          <span className="text-xs mr-1 text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className=" text-gray-500 mb-3 dark:text-gray-400">
          {comment.content}
        </p>
        <div className="flex items-center pt-2 gap-2 border-t dark:border-gray-600 max-w-fit">
          <button
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "text-blue-400"
            }`}
          >
            <FaThumbsUp />
          </button>
          <p className=" text-gray-400 text-xs">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "Like" : "Likes")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comments;
