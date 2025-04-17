import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/primary_components/dashboard/header";
import Footer from "../components/primary_components/dashboard/footer";
import TypingEffect from "../components/primary_components/primary_components/unique_components/word_typing_animate";
import BlogCard from "../components/primary_components/primary_components/cards/blog_card";
import HimeSkeleton from "../skeletons/userpage_skeleton";

interface Author {
  id: string;
  name: string;
  email: string;
  image: string;
  about: string;
}

interface Blog {
  id: string;
  blogHead: string;
  title: string;
  description1: string;
}

export default function Hime() {
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [totalLikes, setTotalLikes] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [followers] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [userRes, statsRes] = await Promise.all([
          fetch(
            "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/user/me",
            { headers }
          ),
          fetch(
            "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/stats",
            { headers }
          ),
        ]);

        const userData = await userRes.json();
        const statsData = await statsRes.json();

        if (userRes.ok) setAuthor(userData);
        else console.error("User fetch error:", userData);

        if (statsRes.ok) {
          setTotalLikes(statsData.totalLikes);
          setBlogCount(statsData.blogCount);
        } else console.error("Stats fetch error:", statsData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (!author?.id) return;

    const fetchBlogs = async () => {
      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const res = await fetch(
          `https://my-app.mrityunjay-jha2005.workers.dev/api/v1/user/author/${author.id}`,
          { headers }
        );
        const data = await res.json();

        if (res.ok) {
          setBlogs(data.blogs || []);
        } else {
          console.error("Blog fetch error:", data);
        }
      } catch (err) {
        console.error("Fetch blogs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [author?.id]);

  if (loading || !author) return <HimeSkeleton />;

  return (
    <>
      <Header />

      {/* Main Section */}
      <main className="p-10 mt-[80px] mx-auto flex flex-col xl:flex-row gap-10">
        <section className="xl:w-1/3 flex flex-col items-center text-center xl:text-left">
          <h1 className="text-7xl lg:text-9xl font-extrabold font-montserrat text-wrap">
            {author.name}
          </h1>
          <div className="xl:ml-10 h-30 w-3/4 sm:w-full">
            <TypingEffect
              texts={[
                "The mountains are calling,and I must go",
                "Trekking is the art of getting lost in nature, and finding yourself",
                "Life is either a daring adventure or nothing at all",
                "Not all those who wander are lost",
                "Every mountain top is within reach if you just keep climbing",
                "In every walk with nature,one receives far more than he seeks",
                "It’s not the mountain we conquer, but ourselves",
                "Take only pictures, leave only footprints",
                "The best view comes after the hardest climb",
              ]}
            />
          </div>
        </section>

        <section className="relative sm:w-2/3  px-4 px-6 lg:px-8 xl:w-1/2 mt-5 mx-auto flex flex-col text-center xl:text-left">
          <button
            onClick={() => navigate("/create")}
            className="absolute lg:absolute relative top-0 mx-auto lg:top-0 lg:right-0 
            w-[250px] w-[300px] lg:w-[200px] 
            h-[60px] text-xl lg:text-2xl 
            font-bold font-montserrat border-4 border-red-500 rounded-full 
            overflow-hidden bg-red-500 text-white 
            group transition-all duration-500 mb-10"
          >
            <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
            <span className="relative tracking-wide font-bold font-montserrat group-hover:text-red-500 transition-colors duration-500">
              CREATE
            </span>
          </button>

          <h2 className="text-5xl lg:text-7xl font-extrabold font-montserrat mb-6 text-gray-800">
            About
          </h2>
          <p className="text-2xl lg:text-3xl font-medium font-montserrat text-gray-700">
            {author.about}
          </p>
          <p className="mt-6 text-xl font-semibold font-montserrat text-gray-600 italic">
            {author.email}
          </p>
        </section>
      </main>

      {/* Stats Section */}
      <div className="flex flex-col w-5/6 mt-10 mx-auto bg-white h-[200px] rounded-xl p-4">
        <div className="flex justify-between items-center divide-x-3 my-auto divide-gray-600">
          {[
            { label: "Likes", value: totalLikes, icon: "heart" },
            { label: "Blogs", value: blogCount, icon: "blog" },
            { label: "Followers", value: followers, icon: "add-friend" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-4 px-4"
            >
              <div className="text-2xl font-black font-montserrat">{value}</div>
              <div className="hidden sm:block text-lg font-bold font-montserrat">
                {label}
              </div>
              <div className="rounded-full mt-2 flex items-center justify-center">
                <img
                  src={`./../images/icons/${icon}.png`}
                  alt={label}
                  className="h-10 sm:h-15"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="mx-20 mt-20 border-0 h-3 bg-black rounded-full" />

      {/* Blogs */}
      <div className="flex flex-wrap gap-6 my-20 justify-center">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="my-10 w-7/8 xl:w-2/8 cursor-pointer"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              <BlogCard
                image={blog.blogHead}
                title={blog.title}
                description={blog.description1}
                showActions={true}
                id={blog.id}
              />
            </div>
          ))
        ) : (
          <p className="text-xl font-semibold font-montserrat mt-10 text-gray-500">
            No blogs found.
          </p>
        )}
      </div>

      {/* View More */}
      <div
        className="flex flex-col justify-center items-center cursor-pointer"
        onClick={() => navigate("/blog_page")}
      >
        <h2 className="text-xl font-semibold font-montserrat transition-all duration-200 transform hover:scale-110 hover:text-blue-500">
          View More
        </h2>
        <img
          src="./../images/icons/down.png"
          alt="View More"
          className="w-10 h-10 transition-all duration-200 hover:scale-130"
        />
      </div>

      <footer className="w-full mt-10">
        <Footer color="bg-black" fontColor="text-white font-bold" />
      </footer>
    </>
  );
}
