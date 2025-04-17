import { motion } from "framer-motion";

interface DataCardProps {
  image: string;
  title: string;
  description: string;
}

export default function Data_card({ image, title, description }: DataCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col gap-4 p-4 w-full sm:w-[90%] md:w-[85%] lg:w-[80%] h-full bg-transparent border-t-4 border-r-4 border-b-4 border-l-0 border-black rounded-xl shadow-xl"
    >
      {/* Left Red Border */}
      <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-red-500 rounded-tl-xl rounded-bl-xl"></div>

      {/* Inner Left Border for Effect */}
      <div className="absolute top-[4px] left-[8px] bottom-[4px] w-[4px] bg-red-500"></div>

      {/* Image (Hidden on Small Screens) */}
      <img
        src={image}
        alt={title}
        className="w-4/6 h-40 sm:h-32 object-cover border-4 p-1 bg-[#E9DDD0] border-[#27405E] rounded-lg shadow-md -mt-10 mx-auto md:block hidden"
      />

      {/* Title & Description */}
      <div className="flex flex-col flex-1 items-center justify-center text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-base md:text-lg leading-relaxed hidden md:block">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
