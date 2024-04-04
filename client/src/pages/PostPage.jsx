import { Button, Spinner } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import PostCreater from "../components/PostCreater";

function PostPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState({});
  const [recentPost, setRecentPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${slug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    // Fetch user data only if post is available
    if (post) {
      const getUser = async () => {
        try {
          const response = await fetch(`/api/user/${post.userId}`);
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
    }
  }, [post]);

  useEffect(() => {
    try {
      const getRecentPost = async () => {
        const response = await fetch("/api/post/getposts?limit=3");
        const data = await response.json();
        if (response.ok) {
          setRecentPost(data.posts);
        } else {
          console.log(data.message);
        }
      };
      getRecentPost();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto min-h-screen w-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className=" flex flex-col p-3 max-w-6xl mx-auto min-h-screen font-[Noto Sans]">
      <h1 className="text-2xl dark:text-zinc-200 mt-10 p-3 text-center max-w-2xl mx-auto md:text-4xl font-bold font-[Syne]">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className=" self-center mt-5"
      >
        <Button size="xs" pill color="gray">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 max-h-[600px] object-cover p-3 w-full"
      />
      <div className="flex items-end justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm mt-3">
        <span className="">
          <PostCreater createdAt={post && post.createdAt} user={user} />
        </span>
        <span>{post && (post.content.length / 1000).toFixed(0)}mins read</span>
      </div>
      <div
        className="p-3 mt-3 mb-5 mx-auto max-w-2xl w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <CommentSection postId={post && post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="mt-5 text-2xl font-[Syne] dark:text-zinc-200  font-semibold">
          Recent articles
        </h1>
        <div className="flex flex-wrap p-3 justify-center gap-5 mt-5">
          {recentPost &&
            recentPost.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                createdAt={post?.createdAt}
              />
            ))}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
