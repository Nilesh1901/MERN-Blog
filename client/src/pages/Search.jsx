import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import PostCard from "../components/PostCard";

function Search() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          setError(data.message);
          return;
        }
        if (response.ok) {
          setLoading(false);
          setPosts(data.posts);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    setError(null);
    if (posts) {
      const numberOfPosts = posts.length;
      const startIndex = numberOfPosts;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();

      try {
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.message);
          return;
        }
        if (response.ok) {
          setError(null);
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="sm:px-10 px-3 py-5 flex flex-col">
      <div className="flex gap-3 text-gray-500 flex-wrap border-b dark:border-gray-600 py-3">
        <Link to={"/search"}>
          <Button
            size="md"
            gradientDuoTone="purpleToPink"
            className="font-semibold"
          >
            All
          </Button>
        </Link>
        <Link to={"/search?category=travel"}>
          <Button
            size="md"
            className="font-semibold !bg-gradient-to-r from-rose-400 to-red-500"
          >
            Travel
          </Button>
        </Link>
        <Link to={"/search?category=Food"}>
          <Button
            size="md"
            gradientDuoTone="purpleToBlue"
            className="font-semibold"
          >
            Food
          </Button>
        </Link>
        <Link to={"/search?category=health"}>
          <Button
            size="md"
            className="font-semibold !bg-gradient-to-r from-violet-200 to-pink-200 text-zinc-800"
          >
            Health
          </Button>
        </Link>
        <Link to={"/search?category=movie"}>
          <Button
            size="md"
            className="font-semibold !bg-gradient-to-r from-amber-500 to-pink-500"
          >
            Movie
          </Button>
        </Link>
        <Link to={"/search?category=fashion"}>
          <Button
            size="md"
            className="font-semibold  !bg-gradient-to-r from-fuchsia-600 to-purple-600"
          >
            Fashion
          </Button>
        </Link>
        <Link to={"/search?category=music"}>
          <Button
            size="md"
            className="font-semibold  !bg-gradient-to-r from-fuchsia-600 to-purple-600"
          >
            Music
          </Button>
        </Link>
        <Link to={"/search?category=horror"}>
          <Button
            size="md"
            className="font-semibold  !bg-gradient-to-r from-red-900 to-red-500"
          >
            Horror
          </Button>
        </Link>
        <Link to={"/search?category=technology"}>
          <Button
            size="md"
            className="font-semibold  bg-gradient-to-r from-emerald-400 to-cyan-400"
          >
            Technology
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-xl mt-5">No post found!</p>
      )}

      {!loading && posts && (
        <div className="flex justify-center flex-wrap gap-4 p-7">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              createdAt={post.createdAt}
              user={post.userId}
            />
          ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full sm:text-lg text-teal-400 hover:underline py-7"
            >
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
