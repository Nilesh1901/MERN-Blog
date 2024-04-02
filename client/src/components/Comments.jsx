import React, { useEffect, useState } from "react";
import moment from "moment";

function Comments({ comment }) {
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
        <p className=" text-gray-500 mb-2 dark:text-gray-400">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export default Comments;
