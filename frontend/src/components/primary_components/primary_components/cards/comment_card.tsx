import { motion } from "framer-motion";

export default function CommentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 250 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.2 }}
      className="w-full p-5 bg-[#e9ddd0] rounded-lg border-5 border-black shadow-md"
    >
      {/* Author Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="./../images/carousel_images/13.jpg"
            alt="Profile"
            className="w-14 object-cover h-14 rounded-full"
          />
          <div>
            <h1 className="text-2xl text-blue-600">Andrew Chandra</h1>
            <p className="text-lg text-gray-500">25 min ago</p>
          </div>
        </div>
        <span className="text-green-500 text-lg font-medium">
          Designing Team
        </span>
      </div>

      {/* Post Content */}
      <div className="mt-2">
        <h2 className="text-xl">It's task management software.</h2>
        <p className="text-black text-xl mt-1">
          Task management software tools abound in the marketplace. Some are
          free; others exist for enterprise-wide deployment purposes...
        </p>
      </div>

      {/* Reactions Section */}
      <div className="flex justify-between items-center mt-3">
        {/* Profile Avatars */}
        <div className="flex -space-x-1">
          <img
            src="./../images/carousel_images/13.jpg"
            alt="User"
            className="w-10 h-10 rounded-full border-2 object-cover border-white"
          />
          <img
            src="./../images/carousel_images/13.jpg"
            alt="User"
            className="w-10 h-10 rounded-full border-2 object-cover border-white"
          />
          <img
            src="./../images/carousel_images/13.jpg"
            alt="User"
            className="w-10 h-10 rounded-full border-2 object-cover border-white"
          />
          <span className="w-10 h-10 flex items-center justify-center bg-gray-300 text-sm text-black rounded-full border-2 border-white">
            +42
          </span>
        </div>

        {/* Like & Comment Icons */}
        <div className="flex items-center space-x-4 mx-10 text-gray-600 text-xl">
          <span className="flex items-center space-x-2">
            💙 <span className="text-lg">39</span>
          </span>
          <span className="flex items-center space-x-2">
            💬 <span className="text-lg">54</span>
          </span>
        </div>
      </div>

      {/* Comment Input */}
      <div className="mt-3 flex items-center border-t pt-2">
        <img
          src="./../images/carousel_images/13.jpg"
          alt="Profile"
          className="w-10 h-10 object-cover rounded-full"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="ml-2 flex-1 px-3 py-2 border rounded-full text-base focus:outline-none"
        />
      </div>
    </motion.div>
  );
}
