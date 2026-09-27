import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  maxDistance?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  className = '',
  particleCount = 55,
  maxDistance = 110
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Handle viewport resize with DPR clamping for high performance
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Color palette with deep space/cyber tones
    const colors = [
      'rgba(6, 182, 212, ',   // cyan
      'rgba(14, 165, 233, ',  // sky blue
      'rgba(139, 92, 246, ',  // violet
      'rgba(226, 232, 240, '  // cool white
    ];

    // Initialize particles
    const particles: Particle[] = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 18000) || particleCount);

    for (let i = 0; i < count; i++) {
      const baseR = 0.8 + Math.random() * 1.6;
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28 - 0.08, // gentle upward drift
        radius: baseR,
        baseRadius: baseR,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.12 + Math.random() * 0.16, // subtle low-opacity
        pulseSpeed: 1 + Math.random() * 2,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Gentle mouse interaction tracking
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / width - 0.5;
      const ny = (e.clientY - rect.top) / height - 0.5;
      mouseRef.current.targetX = nx * 24; // subtle parallax offset in px
      mouseRef.current.targetY = ny * 24;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Pause rendering when scrolled out of view to save battery & GPU
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let lastTime = performance.now();

    // Render loop
    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible || width === 0 || height === 0) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const pxOffset = mouseRef.current.x;
      const pyOffset = mouseRef.current.y;

      // Draw subtle proximity connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.065;
            ctx.beginPath();
            ctx.moveTo(p1.x + pxOffset, p1.y + pyOffset);
            ctx.lineTo(p2.x + pxOffset, p2.y + pyOffset);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw and update particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges seamlessly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Subtle organic breathing pulse
        const pulse = Math.sin(time * 0.0015 * p.pulseSpeed + p.pulseOffset);
        p.radius = p.baseRadius * (1 + 0.18 * pulse);
        const currentAlpha = Math.max(0.04, p.alpha * (1 + 0.25 * pulse));

        // Render particle with soft luminous edge
        ctx.beginPath();
        ctx.arc(p.x + pxOffset, p.y + pyOffset, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      observer.disconnect();
    };
  }, [particleCount, maxDistance]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
