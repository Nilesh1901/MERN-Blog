import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { IoWarningOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";

function DashBoardUsers() {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [userIdToDeleted, setUserIdToDeleted] = useState("");
  const { currentUser } = useSelector((store) => store.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getusers`);
        if (!response.ok) {
          throw new Error("Failed to fetch user users");
        }
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user users:", error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    } else {
      setUsers([]); // Reset user users if not an admin
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const response = await fetch(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await response.json();
      if (response.ok) {
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setshowModal(false);
    try {
      const response = await fetch(`/api/user/delete/${userIdToDeleted}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userIdToDeleted)
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
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-12 rounded-full h-12 object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className=" text-green-500 text-base" />
                    ) : (
                      <TiCancel className=" text-red-500 text-base" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setshowModal(true);
                        setUserIdToDeleted(user._id);
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
                  Are you sure you want to delete this user
                </h3>
                <div className="flex justify-center gap-5">
                  <Button color="failure" onClick={handleDeleteUser}>
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
        <p>You have no users yet!</p>
      )}
    </div>
  );
}

export default DashBoardUsers;
