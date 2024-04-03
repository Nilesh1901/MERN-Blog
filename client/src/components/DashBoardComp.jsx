import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashBoardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/getusers?limit=5");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post/getposts?limit=5");
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comment/getcomments?limit=5");
        const data = await response.json();
        if (response.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    // container
    <div className="p-3 md:mx-auto">
      {/* total users, posts, comments */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* total users */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md font-[syne] font-semibold">
          {/* card top section */}
          <div className="flex justify-between">
            {/* card left section */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            {/* card right section */}
            <HiOutlineUserGroup className="text-5xl bg-teal-500 rounded-full p-3 shadow-lg text-white" />
          </div>
          {/* card bottom section */}
          <div className="flex items-center gap-2  text-green-500">
            <span className="flex items-center text-sm gap-1">
              {lastMonthUsers}
              <HiArrowNarrowUp />
            </span>
            <div className="text-gray-400">Last months</div>
          </div>
        </div>

        {/* total comments */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md font-[syne] font-semibold">
          {/* card top section */}
          <div className="flex justify-between">
            {/* card left section */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            {/* card right section */}
            <HiAnnotation className="text-5xl bg-indigo-500 rounded-full p-3 shadow-lg text-white" />
          </div>
          {/* card bottom section */}
          <div className="flex items-center gap-2  text-green-500">
            <span className="flex items-center text-sm gap-1">
              {lastMonthComments}
              <HiArrowNarrowUp />
            </span>
            <div className="text-gray-400">Last months</div>
          </div>
        </div>

        {/* total posts */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md font-[syne] font-semibold">
          {/* card top section */}
          <div className="flex justify-between">
            {/* card left section */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            {/* card right section */}
            <HiDocumentText className="text-5xl bg-lime-500 rounded-full p-3 shadow-lg text-white" />
          </div>
          {/* card bottom section */}
          <div className="flex items-center gap-2  text-green-500">
            <span className="flex items-center text-sm gap-1">
              {lastMonthPosts}
              <HiArrowNarrowUp />
            </span>
            <div className="text-gray-400">Last months</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mx-auto py-4 gap-5">
        {/* users */}
        <div className=" flex flex-col shadow-md w-full md:w-auto rounded-md p-2 dark:bg-slate-800">
          <div className="flex justify-between font-bold items-center p-3">
            <h1 className="font-[syne] text-center text-zinc-700 text-lg dark:text-zinc-300">
              Recent Users
            </h1>
            <Button gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className=" dark:text-zinc-300 text-zinc-500">
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users &&
                users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 object-cover"
                  >
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-semibold dark:text-zinc-200 text-zinc-700">
                      {user.username}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>

        {/* comments */}
        <div className=" flex flex-col shadow-md w-full md:w-auto rounded-md p-2 dark:bg-slate-800">
          <div className="flex justify-between font-bold items-center p-3">
            <h1 className="font-[syne] text-center text-zinc-700 text-lg dark:text-zinc-300">
              Recent Comments
            </h1>
            <Button gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className=" dark:text-zinc-300 text-zinc-500">
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments &&
                comments.map((comment) => {
                  // Find the post corresponding to the comment
                  const correspondingPost = posts.find(
                    (post) => post._id === comment.postId
                  );
                  // Get the title of the corresponding post
                  const postTitle = correspondingPost
                    ? correspondingPost.title
                    : "";

                  return (
                    <Table.Row
                      key={comment._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="font-semibold dark:text-zinc-200 text-zinc-700 w-96">
                        <p className=" line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                      <Table.Cell className=" w-72">
                        <p className="line-clamp-2">{postTitle}</p>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </div>

        {/* posts */}
        <div className="flex flex-col shadow-md w-full md:w-auto rounded-md p-2 dark:bg-slate-800">
          <div className="flex justify-between font-bold items-center p-3">
            <h1 className="font-[syne] text-center text-zinc-700 text-lg dark:text-zinc-300">
              Recent Posts
            </h1>
            <Button gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=post"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className=" dark:text-zinc-300 text-zinc-500">
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts &&
                posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt={post.username}
                        className="w-14 h-10 rounded-md bg-gray-500 object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-semibold dark:text-zinc-200 text-zinc-700">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DashBoardComp;
