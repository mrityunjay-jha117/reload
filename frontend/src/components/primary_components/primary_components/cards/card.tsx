import { useState } from "react";
import { motion } from "framer-motion";

type CardProps = {
  imgSrc: string;
  title: string;
  description: string;
  design?: string;
  height?: string;

};

export default function Card({
  imgSrc,
  title,
  description,
  design,
  height,
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 250 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.2 }}
      className={`overflow-hidden ${design ? design : "w-[400px]"} ${
        height ? height : "h-full"
      }`}
    >
      <div
        // Ensure this inner div also fills the parent's height
        className="relative h-full overflow-hidden rounded-2xl shadow-lg transition duration-500"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={imgSrc}
          alt={title}
          // Use object-cover to maintain aspect ratio without stretching
          className={`w-full h-full object-cover transition-transform duration-500 rounded-2xl ${
            hovered ? "scale-110" : ""
          }`}
        />
        <div
          className={`absolute bottom-2 left-0 w-full bg-black/60 p-3 text-white transition-opacity duration-500 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
