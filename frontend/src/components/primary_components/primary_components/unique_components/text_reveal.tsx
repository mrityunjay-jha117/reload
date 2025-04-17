import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TextMaskParallaxProps = {
  text: string;
  images: string[];
};

export default function TextRevealParallax({ text, images }: TextMaskParallaxProps) {
  // Adjust totalDuration for smoother animation with many images
  const totalDuration = 2500; // in ms
  const frameDuration = totalDuration / images.length;

  const [imageIndex, setImageIndex] = useState(0);
  const [animationFinished, setAnimationFinished] = useState(false);

  const navigate = useNavigate();

  // Cycle through images using a single interval
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= images.length) {
        clearInterval(interval);
        setAnimationFinished(true);
      } else {
        setImageIndex(currentIndex);
      }
    }, frameDuration);

    return () => clearInterval(interval);
  }, [images.length, frameDuration]);

  // Navigate after the animation is finished
  useEffect(() => {
    if (animationFinished) {
      // Small delay so the exit animation can finish
      const navTimeout = setTimeout(() => navigate("/home"), 600);
      return () => clearTimeout(navTimeout);
    }
  }, [animationFinished, navigate]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={animationFinished ? { y: "-80%", opacity: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden z-50"
    >
      <AnimatePresence>
        {!animationFinished && (
          <motion.div
            key="textMask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <motion.h1
              className="font-bold xl:font-black xl:tracking-wider uppercase text-center text-3xl sm:text-5xl xl:text-9xl "
              // Start scale at 1, end at 1.5 over totalDuration
              initial={{ scale: 1 }}
              animate={{ scale: 2.5 }}
              transition={{ duration: totalDuration / 1000, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${images[imageIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {text}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
