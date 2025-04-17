import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SideScroll() {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("country");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("jwt");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let endpoint = "";
    switch (selectedField) {
      case "country":
        endpoint = `/location?country=${encodeURIComponent(searchQuery)}`;
        break;
      case "author":
        endpoint = `/author?name=${encodeURIComponent(searchQuery)}`;
        break;
      case "title":
        endpoint = `/title?title=${encodeURIComponent(searchQuery)}`;
        break;
      default:
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(
        `https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/search${endpoint}`,
        { headers }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Fetched blogs:", result);
        setBlogs(result.blogs || []);
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className="sticky top-0 right-0 no-scrollbar lg:flex whitespace-nowrap cursor-grab lg:flex-col flex-shrink-0 w-full overflow-y-auto active:cursor-grabbing bg-black text-white p-4 gap-2 transparent-scrollbar"
    >
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by ${selectedField}`}
          className="h-14 rounded-full text-center mb-4 border-4 border-white text-white text-2xl"
        />

        {/* Radio Buttons */}
        <div className="flex flex-row justify-around gap-2">
          {["author", "title", "country"].map((field) => (
            <label
              key={field}
              className={`cursor-pointer p-2 w-30 text-center rounded-full border-4 ${
                selectedField === field
                  ? "bg-red-500 text-white"
                  : "bg-transparent text-white"
              }`}
            >
              <input
                type="radio"
                name="searchField"
                value={field}
                checked={selectedField === field}
                onChange={(e) => setSelectedField(e.target.value)}
                className="hidden"
              />
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="p-2 w-full h-[60px] rounded-full mt-4 text-2xl text-white tracking-wide 
             bg-green-600 border-6 border-green-600 overflow-hidden relative flex items-center 
             justify-center group transition-all duration-500"
        >
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          <span className="relative group-hover:text-green-600 transition-colors duration-500">
            Search
          </span>
        </button>
      </form>

      {/* Results */}
      {loading && <div className="p-2 text-center">Loading...</div>}

      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog.id}
            className="relative h-80 flex flex-col justify-end gap-12 p-4 text-white bg-cover bg-center rounded-4xl shadow-xl transition-transform transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            style={{
              backgroundImage: `url(${blog.blogHead})`,
            }}
            onClick={() => {
              navigate(`/blog/${blog.id}`);
            }}
          >
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-2xl"></div>

            <div className="relative bottom-0 z-10">
              <h3 className="text-xl text-wrap">{blog.title}</h3>
              <p className="text-sm text-white ml-8">{blog.author.name}</p>
              <p className="line-clamp-2 text-wrap text-white">{blog.description1}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-2 text-center">
          {loading ? "" : "No blogs found. Try searching again."}
        </div>
      )}
    </aside>
  );
}
