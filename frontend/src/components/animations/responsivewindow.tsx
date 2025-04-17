import React, { useState, useEffect } from 'react';
import ParticleCanvas from './particle';

const ResponsiveParticleCanvas: React.FC = () => {
  // Holds current window width.
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    // Clean up the event listener on unmount.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Tailwind's default 'sm' breakpoint is 640px.
  const isMobile = windowWidth < 640;

  // Set props based on device type.
  const particleCount = isMobile ? 3000 : 8000;
  const forceRadius = isMobile ? 75 : 100; // Adjust circle radius similarly.

  return (
    <div className="h-[50vh] w-full ">
      <ParticleCanvas particleCount={particleCount} forceRadius={forceRadius} />
    </div>
  );
};

export default ResponsiveParticleCanvas;
