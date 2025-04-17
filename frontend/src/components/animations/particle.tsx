import React, { useRef, useEffect } from 'react';

type ParticleCanvasProps = {
  particleCount?: number; // Total number of particles
  forceRadius?: number;   // Radius (in pixels) where particles react
};

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseX = x;
    this.baseY = y;
    // Particle density affects how far the particle will be pushed.
    this.density = Math.random() * 30 + 1;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(pointerPos: { x: number; y: number }, forceRadius: number) {
    const dx = pointerPos.x - this.x;
    const dy = pointerPos.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If the pointer is within the influence radius, displace the particle.
    if (distance < forceRadius) {
      const angle = Math.atan2(dy, dx);
      const force = (forceRadius - distance) / forceRadius;
      const moveX = force * this.density * Math.cos(angle);
      const moveY = force * this.density * Math.sin(angle);
      this.x -= moveX;
      this.y -= moveY;
    } else {
      // Gradually bring the particle back to its original position.
      if (this.x !== this.baseX) {
        const dxBase = this.x - this.baseX;
        this.x -= dxBase / 10;
      }
      if (this.y !== this.baseY) {
        const dyBase = this.y - this.baseY;
        this.y -= dyBase / 10;
      }
    }
  }
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  particleCount = 300,  // Default particle count if not provided
  forceRadius = 150     // Default force radius if not provided
}) => {
  // Reference to the container div.
  const containerRef = useRef<HTMLDivElement>(null);
  // Reference to the canvas element.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Array to store Particle objects.
  const particlesRef = useRef<Particle[]>([]);
  // Reference to store the requestAnimationFrame ID.
  const animationFrameIdRef = useRef<number>();
  // Pointer position—used for both mouse and touch events.
  const pointerPositionRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  // Synchronize the canvas's drawing dimensions with its container.
  const setCanvasDimensions = () => {
    if (containerRef.current && canvasRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
    }
  };

  // Create particles evenly distributed over the canvas.
  const initParticles = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      // Particle size is randomized between 0.5 and 2.5 pixels.
      const size = Math.random() * 1.5 +0.5;
      const color = 'rgba(255, 255, 255, 0.8)';
      particles.push(new Particle(x, y, size, color));
    }
    particlesRef.current = particles;
  };

  // The animation loop: clear the canvas, update particles, and redraw.
  const animate = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      particle.update(pointerPositionRef.current, forceRadius);
      particle.draw(ctx);
    });

    animationFrameIdRef.current = requestAnimationFrame(() => animate(ctx));
  };

  useEffect(() => {
    // Set up the canvas dimensions to match its container.
    setCanvasDimensions();
    // Create particles.
    initParticles();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Event handlers update pointerPosition for mouse or touch events.
    const handleMouseMove = (e: MouseEvent) => {
      pointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerPositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };
    // Reset pointer when touch ends.
    const handleTouchEnd = () => {
      pointerPositionRef.current = { x: -100, y: -100 };
    };
    // On window resize, update the canvas size and reinitialize particles.
    const handleResize = () => {
      setCanvasDimensions();
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    // Start the animation loop.
    animate(ctx);

    // Clean up event listeners and stop the animation on unmount.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [particleCount, forceRadius]); // Re-run effect if these props change

  return (
    // The outer container uses Tailwind classes to control width/height responsively.
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="block bg-black" />
    </div>
  );
};

export default ParticleCanvas;
