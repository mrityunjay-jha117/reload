import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
interface DataCardProps {
  image: string;
  title: string;
  description: string;
  showActions?: boolean;
  id?: string;
}

export default function BlogCard({
  image,
  title,
  description,
  showActions,
  id,
}: DataCardProps) {
  const navigate = useNavigate();
  // Function to call the backend delete route
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the card's onClick (navigation) from firing.
    e.stopPropagation();
    if (!id) return;

    const token = localStorage.getItem("jwt");
    try {
      const res = await fetch(
        `https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        console.log("Blog deleted successfully");
        // Optionally, trigger a refresh or update state to remove the deleted card.
      } else {
        const errorData = await res.json();
        console.error("Delete error:", errorData.message);
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col gap-6 p-5 bg-transparent border-t-4 border-r-4 border-b-4 border-l-0 border-black rounded-xl shadow-xl overflow-visible"
      // Clicking the whole card navigates to the blog detail page.
      onClick={() => {
        if (id) {
          // Navigate to blog detail page.
          // For example, using react-router's navigate (if passed as a prop or via context),
          // or any other method your app uses for navigation.
          navigate(`/blog/${id}`);
        }
      }}
    >
      {/* Outer red border */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500 rounded-tl-xl rounded-bl-xl"></div>
      <div className="absolute top-1 left-2 bottom-1 w-1 bg-red-300"></div>

      <img
        alt={title}
        src={image}
        className="object-cover sm:h-[150px] sm:w-full border-6 p-1 bg-[#E9DDD0] border-[#27405E] rounded-lg shadow-md -mt-18  z-10 mx-auto"
      />
      <div className="h-full flex flex-col flex-1 items-center justify-center text-center">
        <h1 className="text-md md:text-3xl  line-clamp-3 text-wrap font-semibold">
          {title}
        </h1>
        <p className="mt-1 line-clamp-4 text-xs">{description}</p>
      </div>

      {showActions && (
        <div className="flex flex-row justify-center gap-4">
          <button
            className="w-1/2 mx-auto h-[40px] text-md  rounded-full overflow-hidden bg-white text-black tracking-wide group transition-colors duration-500 border border-black group-hover:border-white relative"
            onClick={handleDelete}
          >
            <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
            <span className="relative group-hover:text-white font-bold transition-colors duration-500">
              DELETE
            </span>
          </button>
          <button
            className="w-1/2 mx-auto h-[40px] text-md rounded-full overflow-hidden bg-red-500 text-white tracking-wide group transition-all duration-500 relative"
            onClick={(e) => {
              e.stopPropagation();
              if (id) {
                navigate(`/update/${id}`);
              }
            }}
          >
            <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
            <span className="relative group-hover:text-red-500 font-bold transition-colors duration-500">
              UPDATE
            </span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
