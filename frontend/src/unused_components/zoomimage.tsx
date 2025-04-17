import { useState, useRef } from "react";

type ZoomImageProps = {
  src: string;
  alt?: string;
};

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt = "Zoom Image" }) => {
  const [zoomStyle, setZoomStyle] = useState<{
    opacity: number;
    transform: string;
    clipPath?: string;
  }>({
    opacity: 0,
    transform: "scale(1.5)",
  });

  const zoomRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } =
      zoomRef.current.getBoundingClientRect();
    const positionX = ((event.clientX - left) / width) * 100;
    const positionY = ((event.clientY - top) / height) * 100;

    setZoomStyle({
      opacity: 1,
      transform: `scale(1.5) translate(${-(positionX - 50) / 3.5}%, ${
        -(positionY - 50) / 3.5
      }%)`,
      clipPath: `circle(100px at ${positionX}% ${positionY}%)`,
    });
  };

  return (
    <div
      ref={zoomRef}
      className="relative w-max"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setZoomStyle({ opacity: 0, transform: "scale(1.5)" })}
    >
      <img src={src} alt={alt} className="w-[500px]" />
      <img
        src={src}
        alt={alt}
        className="absolute left-0 top-0 pointer-events-none w-[500px]"
        style={zoomStyle}
      />
    </div>
  );
};

export default ZoomImage;
