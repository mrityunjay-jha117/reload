import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/primary_components/dashboard/header";
import ImageSlider from "../components/primary_components/primary_components/slider/draggable_slider";
import Footer from "../components/primary_components/dashboard/footer";
import Error404 from "./error/coming_soon";
import HimeSkeleton from "../skeletons/userpage_skeleton"; // Import the skeleton component

export default function Blogi() {
  const { id: blogId } = useParams();
  const [BLOG, setBlogs] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await fetch(
          `https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/${blogId}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blog data");
        }
        const data = await response.json();
        setBlogs(data.blog);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [blogId]);

  return (
    <div className="bg-[#e9ddd0] min-h-screen flex flex-col">
      <Header />

      {loading ? (
        <div className="flex-grow">
          <HimeSkeleton />
        </div>
      ) : error ? (
        <div className="flex-grow">
          <Error404 />
        </div>
      ) : (
        <div className="flex flex-col">
          <img
            src={BLOG.blogHead}
            alt="Blog banner"
            className="mt-[80px] w-full h-[300px] object-cover border-black"
          />
          <div className="flex mt-[80px] flex-col">
            <h1 className="text-7xl lg:text-8xl xl:text-9xl text-red-500 lilita-one-regular font-bold text-center xl:text-left xl:ml-[100px]">
              {BLOG.title}
            </h1>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col mt-2 text-2xl sm:text-3xl text-black lilita-one-regular font-bold ml-[80px] sm:ml-[150px]">
                <span>
                  {BLOG.location.city}, {BLOG.location.country}
                </span>
                <span>by {BLOG.author.name}</span>
              </div>
              <div className="flex flex-row mr-10 text-2xl sm:text-3xl items-center gap-3">
                {BLOG.likes}
                <img
                  src="./../images/carousel_images/13.jpg"
                  alt=""
                  className="sm:h-20 h-15 w-15 sm:w-20 rounded-full border-2 border-transparent object-cover"
                />
              </div>
            </div>

            <hr className="border-t-5 border-black my-7 mx-20" />

            <p className="my-[50px] mx-4 mx-8 md:mx-20 lg:mx-34 xl:mx-60 text-xl text-2xl md:text-3xl lilita-one-regular text-black max-w-7xl leading-relaxed">
              {BLOG.description1}
            </p>

            <div className="relative w-full h-[400px]">
              <div className="absolute w-full h-[300px] xl:h-full xl:right-0 xl:w-[75%]">
                <ImageSlider images={BLOG.images} />
              </div>
            </div>

            <p className="my-[50px] mx-4 mx-8 md:mx-20 lg:mx-34 xl:mx-60 text-xl text-2xl md:text-3xl lilita-one-regular text-black max-w-7xl leading-relaxed">
              {BLOG.description2}
            </p>
          </div>
          <hr className="border-t-5 border-black m-8" />
        </div>
      )}

      <Footer imglink={BLOG?.footerImage} />
    </div>
  );
}
