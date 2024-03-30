import { Button, Spinner } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function PostPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/getposts?slug=${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data.posts[0]);
        setError(false);
      } catch (error) {
        console.log(error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto min-h-screen w-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className=" flex flex-col p-3 max-w-6xl mx-auto min-h-screen font-[Noto Sans]">
      <h1 className="text-3xl mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl">
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
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm mt-3">
        <span>
          {post && new Date(post.createdAt).toLocaleDateString("en-IN")}
        </span>
        <span className=" italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 mt-3 mb-5 mx-auto max-w-2xl w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
    </main>
  );
}

export default PostPage;
