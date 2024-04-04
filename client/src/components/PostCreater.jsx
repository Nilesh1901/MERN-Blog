import React from "react";

function PostCreater({ user, createdAt }) {
  return (
    <div className="flex gap-2 p-2 px-3 text-xs dark:bg-slate-800 roun rounded-lg bg-slate-200">
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-10 h-10 rounded-lg"
      />
      <div className="flex flex-col justify-end">
        <p className="font-bold text-sm dark:text-white">{user.username}</p>
        <p className="text-gray-500 font-medium dark:text-gray-400">
          {new Date(createdAt).toLocaleDateString("en-IN")}
        </p>
      </div>
    </div>
  );
}

export default PostCreater;
