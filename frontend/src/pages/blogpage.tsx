import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/primary_components/dashboard/header";
import Footer from "../components/primary_components/dashboard/footer";
import BlogCard from "../components/primary_components/primary_components/cards/blog_card";
import SideScroll from "../components/primary_components/dashboard/side_scroll";
import HimeSkeleton from "../skeletons/userpage_skeleton"; // adjust path if needed

const BlogPage: React.FC = () => {
  const [blogData, setBlogData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await fetch(
          "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/bulk",
          { headers }
        );
        if (response.ok) {
          const result = await response.json();
          if (result.blogs) setBlogData(result.blogs);
        } else {
          console.error("Failed to fetch data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {isLoading ? (
        <div className="flex-grow">
          <HimeSkeleton />
        </div>
      ) : (
        <div className="flex lg:flex-row mt-[80px] flex-grow min-h-0">
          {/* Blog Content Section */}
          <div className="lg:w-3/4 p-5 mt-20">
            <div className="flex flex-wrap justify-center gap-10">
              {blogData.length > 0 ? (
                blogData.map((blog) => (
                  <div
                    key={blog.id}
                    className="my-10 w-7/8 xl:w-2/8 cursor-pointer"
                    onClick={() => navigate(`/blog/${blog.id}`)}
                  >
                    <BlogCard
                      image={blog.blogHead}
                      title={blog.title}
                      description={blog.description1}
                      showActions={false}
                    />
                  </div>
                ))
              ) : (
                <p className="text-xl mt-10 text-gray-500">No blogs available.</p>
              )}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:w-1/4 pl-5">
            <div className="hidden lg:block lg:sticky lg:top-[80px] lg:max-h-screen lg:overflow-y-auto lg:z-10">
              <SideScroll />
            </div>
          </div>
        </div>
      )}

      <Footer fontColor="text-white" color="bg-black" />
    </div>
  );
};

export default BlogPage;
