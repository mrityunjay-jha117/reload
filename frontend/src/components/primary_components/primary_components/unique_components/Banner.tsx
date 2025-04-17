import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const bgImages = [
  "/images/banner_images/0.png",
  "/images/banner_images/1.png",
  "/images/banner_images/2.png",
  "/images/banner_images/3.png",
  "/images/banner_images/4.png",
  "/images/banner_images/5.png",
  "/images/banner_images/6.png",
  "/images/banner_images/7.png",
  "/images/banner_images/8.png",
];

export default function Banner() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImages[0]})` }}
      />

{/* Scrolling Images with Vertical Movement */}
{bgImages.slice(1).map((src, index) => (
  <motion.div
    key={index}
    className="absolute left-0 bg-cover bg-center bottom-0 w-full h-full"
    initial={{ y: "100%" }}
    animate={{ y: scrollY * (index / 2) }} // Keep scroll movement for all images
    transition={{
      ease: "easeOut",
      duration: 2.5,
      delay: index * 0.2
    }}
  >
    <motion.div
      className="w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${src})` }}
      animate={index === bgImages.length - 2 ? {} : { y: [0, -1.5, 1.5, 0] }} // Remove shakiness for last image
      transition={index === bgImages.length - 2 ? {} : {
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeOut",
        duration: 1.5
      }}
    />
  </motion.div>
))}

    </div>
  );
}
