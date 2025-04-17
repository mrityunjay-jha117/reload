import React, { useRef, useEffect } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  density: number;
  oscillationCount: number;
  lastDisplacementSign: number;
}

interface ParticleTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  sampleGap?: number;
  forceRadius?: number;
}

const ParticleText: React.FC<ParticleTextProps> = ({
  text,
  fontSize = 150,
  color = '#ffffff',
  sampleGap = 6, // Higher gap = fewer particles
  forceRadius = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -999, y: -999, vx: 0, vy: 0 });
  const prevPointerRef = useRef({ x: -999, y: -999 });

  const updateCanvasSize = () => {
    if (containerRef.current && canvasRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
    }
  };

  const createParticles = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const particles: Particle[] = [];

    for (let y = 0; y < height; y += sampleGap) {
      for (let x = 0; x < width; x += sampleGap) {
        const index = (y * width + x) * 4;
        const [r, g, b, a] = [data[index], data[index + 1], data[index + 2], data[index + 3]];
        if (r + g + b > 100 && a > 128) {
          particles.push({
            baseX: x,
            baseY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            density: Math.random() * 5 + 1,
            oscillationCount: 0,
            lastDisplacementSign: 0,
          });
        }
      }
    }

    particlesRef.current = particles;
  };

  const animate = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = particlesRef.current;
    const pointer = pointerRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < forceRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (forceRadius - dist) / forceRadius;

        // Particle response scales with cursor velocity
        const speedFactor = Math.sqrt(pointer.vx ** 2 + pointer.vy ** 2) * 0.2;
        const velocity = force * p.density * speedFactor;

        p.vx -= Math.cos(angle) * velocity;
        p.vy -= Math.sin(angle) * velocity;
      }

      // Track oscillation
      const dxBase = p.baseX - p.x;
      const currentSign = Math.sign(dxBase);
      if (currentSign !== 0 && currentSign !== p.lastDisplacementSign) {
        p.oscillationCount += 1;
      }
      p.lastDisplacementSign = currentSign;

      // Damped spring logic
      const spring = p.oscillationCount < 3 ? 0.03 : 0.005;
      const damping = p.oscillationCount < 3 ? 0.92 : 0.95;

      p.vx += dxBase * spring;
      p.vy += (p.baseY - p.y) * spring;

      p.vx *= damping;
      p.vy *= damping;

      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, 4, 4); // <-- 1px * 1px
    }

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    updateCanvasSize();
    createParticles();
    animate();

    const handleResize = () => {
      updateCanvasSize();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [text, fontSize, sampleGap]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const prev = prevPointerRef.current;

    // Track pointer velocity
    const dx = currentX - prev.x;
    const dy = currentY - prev.y;

    pointerRef.current = {
      x: currentX,
      y: currentY,
      vx: dx,
      vy: dy,
    };

    prevPointerRef.current = {
      x: currentX,
      y: currentY,
    };
  };

  const handleMouseLeave = () => {
    pointerRef.current = { x: -999, y: -999, vx: 0, vy: 0 };
    prevPointerRef.current = { x: -999, y: -999 };
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[40vh] bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticleText;
