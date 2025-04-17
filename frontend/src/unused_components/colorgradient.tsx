import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function GradientScroll({ colors, children }: { colors: string[], children: React.ReactNode }) {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;

      const index = Math.min(Math.floor(scrollFraction * (colors.length - 1)), colors.length - 2);
      const color1 = colors[index];
      const color2 = colors[index + 1];
      const mixPercent = (scrollFraction * (colors.length - 1)) % 1;

      const gradient = `linear-gradient(to bottom, ${color1} ${(1 - mixPercent) * 100}%, ${color2} ${mixPercent * 100}%)`;

      controls.start({ background: gradient });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [colors, controls]);

  return (
    <motion.div 
      className="w-full min-h-[200vh] transition-all duration-500"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
