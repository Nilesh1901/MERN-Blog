import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex w-screen h-screen">
      <div id="hero-image" className=" sm:w-screen w-0 h-0 sm:h-[100%]">
        <div className="flex sm:justify-end items-center lg:pr-20 sm:pt-20 sm:pr-15 justify-center px-5 py-5">
          <div className="hero-text-section text-left sm:ml-8 flex flex-col gap-4 lg:max-w-2xl max-w-[500px]">
            <h1 className="font-bold font-[syne] text-3xl sm:text-5xl lg:text-6xl leading-tight text-zinc-800 dark:text-white">
              Welcome to my Blog
            </h1>
            <h2 className="font-medium font-[syne] text-lg sm:text-xl lg:text-xl mb-2">
              Where Curiosity Thrives and Ideas Flourish
            </h2>
            <div>
              <h3 className="font-medium text-lg mb-2">Introduction:</h3>
              <p className="text-base dark:text-zinc-400 text-zinc-500 ">
                Step into a world where curiosity knows no bounds and ideas take
                flight. Welcome to Insightful Minds, your haven for exploration
                and inspiration.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Our Mission:</h3>
              <p className="text-base dark:text-zinc-400 text-zinc-500">
                At Insightful Minds, we're dedicated to nurturing your thirst
                for knowledge and fostering a community where every voice
                matters.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">
                Join the Conversation:
              </h3>
              <p className="text-base dark:text-zinc-400 text-zinc-500">
                Explore our curated content, engage with fellow seekers, and
                embark on a journey of discovery unlike any other.
              </p>
            </div>
            <Link
              to={"/search"}
              className="text-teal-400 font-bold font-[syne] text-lg hover:underline mb-4"
            >
              View all Blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
