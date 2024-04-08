import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Modal, Textarea } from "flowbite-react";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Comments({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((store) => store.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
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
  }, []);
  // added second useeffect
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId._id}`);
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const response = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsEditing(false);
        onEdit(comment._id, editedContent);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const response = await fetch(`/api/comment/delete/${comment._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        onDelete(comment._id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
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
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              className=""
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className=" flex justify-end gap-2 mt-2">
              <Button
                size="sm"
                type="button"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className=" text-gray-500 mb-3 dark:text-gray-400">
              {comment.content}
            </p>
            <div className="flex items-center pt-2 gap-2 border-t dark:border-gray-600 max-w-fit text-xs">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-400"
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
              {currentUser && // make the changes here also
                (user._id === currentUser._id || currentUser.isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div>
              <IoWarningOutline className="h-14 w-14 text-gray-400 mx-auto mb-5 dark:text-gray-200" />
              <h3 className="text-center text-gray-500 dark:text-gray-400 mb-5">
                Are you sure you want to delete this comment
              </h3>
              <div className="flex justify-center gap-5">
                <Button color="failure" onClick={handleDelete}>
                  Yes I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Comments;
