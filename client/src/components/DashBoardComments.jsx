import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { IoWarningOutline } from "react-icons/io5";


function DashBoardComments() {
  const [comments, setcomments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentIdToDeleted, setCommentIdToDeleted] = useState("");
  const { currentUser } = useSelector((store) => store.user);
  useEffect(() => {
    setLoading(true);
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getcomments`);
        if (!response.ok) {
          setLoading(false);
          throw new Error("Failed to fetch comment comments");
        }
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          setcomments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching user comments:", error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    } else {
      setcomments([]); // Reset user comments if not an admin
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const response = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await response.json();
      if (response.ok) {
        setcomments((prevComments) => [...prevComments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setshowModal(false);
    try {
      const response = await fetch(
        `/api/comment/delete/${commentIdToDeleted}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setcomments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentIdToDeleted)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading && (
        <div className="flex justify-center items-center mx-auto min-h-screen w-full">
          <Spinner size="xl" />
        </div>
      )}
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>number of likes</Table.HeadCell>
              <Table.HeadCell>postId</Table.HeadCell>
              <Table.HeadCell>userId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString("en-IN")}
                  </Table.Cell>
                  <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell className="w-96">
                    <p className="line-clamp-2">{comment.postId.title}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.userId.username}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setshowModal(true);
                        setCommentIdToDeleted(comment._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              className="w-full py-7 text-sm text-teal-400 "
              onClick={handleShowMore}
            >
              show More
            </button>
          )}
          <Modal
            show={showModal}
            onClose={() => setshowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div>
                <IoWarningOutline className="h-14 w-14 text-gray-400 mx-auto mb-5 dark:text-gray-200" />
                <h3 className="text-center text-gray-500 dark:text-gray-400 mb-5">
                  Are you sure you want to delete this comment?
                </h3>
                <div className="flex justify-center gap-5">
                  <Button color="failure" onClick={handleDeleteComment}>
                    Yes I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setshowModal(false)}>
                    No cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
    </div>
  );
}

export default DashBoardComments;
