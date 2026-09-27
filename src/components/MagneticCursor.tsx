import React, { useEffect, useRef, useState } from 'react';

export const MagneticCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isInsideHero, setIsInsideHero] = useState(false);

  // Position refs for frame-rate independent spring interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const targetPull = useRef<{ x: number; y: number } | null>(null);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    // Only enable on desktop/fine-pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mousePos.current = { x: clientX, y: clientY };
      if (!isVisible) setIsVisible(true);

      // Check if cursor is inside the hero scratch canvas area
      const target = e.target as HTMLElement | null;
      const insideHero = Boolean(target?.closest('#hero'));
      setIsInsideHero(insideHero);

      // Check if hovering near or over interactive elements
      const interactiveEl = target?.closest(
        'button, a, [data-magnetic="true"], [role="button"], input, textarea, .group[data-project-card]'
      ) as HTMLElement | null;

      if (interactiveEl && !insideHero) {
        setIsHoveringInteractive(true);
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Subtle magnetic pull toward element center (25% blend towards center)
        const pullX = clientX + (centerX - clientX) * 0.32;
        const pullY = clientY + (centerY - clientY) * 0.32;
        targetPull.current = { x: pullX, y: pullY };
      } else {
        setIsHoveringInteractive(false);
        targetPull.current = null;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Render loop with smooth spring damping
    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Target position is either magnetically attracted position or raw mouse
      const targetX = targetPull.current ? targetPull.current.x : mousePos.current.x;
      const targetY = targetPull.current ? targetPull.current.y : mousePos.current.y;

      // Spring damping for outer magnetic ring (k approx 18)
      const k = 1 - Math.exp(-20 * dt);
      ringPos.current.x += (targetX - ringPos.current.x) * k;
      ringPos.current.y += (targetY - ringPos.current.y) * k;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible]);

  // Don't render on touch screens or when hidden/inside hero scratch area
  if (!isVisible || isInsideHero) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 transition-opacity duration-200 ${
          isHoveringInteractive ? 'opacity-40 scale-75' : 'opacity-90 scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Trailing Magnetic Halo Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-all duration-300 ease-out ${
          isHoveringInteractive
            ? '-ml-5 -mt-5 w-10 h-10 border-cyan-400 bg-cyan-400/15 shadow-lg shadow-cyan-500/25 scale-110'
            : '-ml-3.5 -mt-3.5 w-7 h-7 border-cyan-400/40 bg-transparent scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
