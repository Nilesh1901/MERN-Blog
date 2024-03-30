import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

function DashBoardPost() {
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [postIdToDeleted, setPostIdToDeleted] = useState("");
  const { currentUser } = useSelector((store) => store.user);
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/getposts?userId=${currentUser?._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUserPosts();
    } else {
      setUserPosts([]); // Reset user posts if not an admin
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `/api/post/getposts?userId=${currentUser?._id}&startIndex=${startIndex}`
      );
      const data = await response.json();
      if (response.ok) {
        setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setshowModal(false);
    try {
      const response = await fetch(
        `/api/post/deletepost/${postIdToDeleted}/${currentUser._id}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prevPost) => {
          return prevPost.filter((post) => post._id !== postIdToDeleted);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString("en-IN")}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className=" font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setshowModal(true);
                        setPostIdToDeleted(post._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className=" text-teal-400 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
                  Are you sure you want to delete this post
                </h3>
                <div className="flex justify-center gap-5">
                  <Button color="failure" onClick={handleDeletePost}>
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
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}

export default DashBoardPost;
