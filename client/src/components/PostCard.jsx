import { Link } from "react-router-dom";
import PostCreater from "./PostCreater";

function PostCard({ post, user, createdAt }) {
  return (
    <div className="group relative w-[450px] border-teal-500 hover:border-2 border h-[410px] overflow-hidden rounded-lg sm:w-[420px]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="w-full h-[255px] object-cover group-hover:h-[200px] transition-all duration-200 z-20"
        />
      </Link>
      <div className="p-3 font-[Syne] flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <div className="flex justify-between sm:items-center flex-col sm:flex-row gap-3">
          <span className="italic text-sm">{post.category} </span>
          <span>
            <PostCreater user={user} createdAt={createdAt} />
          </span>
        </div>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
