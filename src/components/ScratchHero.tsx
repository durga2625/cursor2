import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrushStamp } from '../types';
import { ArrowDown, Image as ImageIcon, Sparkles, FileText, Mail } from 'lucide-react';
import { MagneticElement } from './MagneticElement';
import { ParticleField } from './ParticleField';

interface ScratchHeroProps {
  image1Url: string;
  image2Url: string;
  onOpenImageModal: () => void;
  onOpenPdfModal?: () => void;
  onOpenContactModal?: () => void;
}

export const ScratchHero: React.FC<ScratchHeroProps> = ({
  image1Url,
  image2Url,
  onOpenImageModal,
  onOpenPdfModal,
  onOpenContactModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bottomImageRef = useRef<HTMLImageElement>(null);

  // Loaded image element for IMAGE 1 (the canvas overlay)
  const image1ElementRef = useRef<HTMLImageElement | null>(null);
  const [image1Loaded, setImage1Loaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);

  // Interaction tracking state
  const [hasInteracted, setHasInteracted] = useState(false);

  // References for requestAnimationFrame loop
  const stampsRef = useRef<BrushStamp[]>([]);
  const isPointerInsideRef = useRef(false);
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);
  const smoothedPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastStampPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastAngleRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Load Image 1 into HTMLImageElement for canvas drawing
  useEffect(() => {
    setImage1Loaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image1Url;
    img.onload = () => {
      image1ElementRef.current = img;
      setImage1Loaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load Image 1');
    };
  }, [image1Url]);

  // Pre-generate irregular internal hole geometries for realistic dry-brush texture
  const generateIrregularHoles = useCallback((seed: number, baseRadius: number) => {
    const numHoles = Math.floor((seed % 3)) + 1; // 1 to 3 irregular holes
    const holes = [];
    for (let h = 0; h < numHoles; h++) {
      const angleOffset = ((seed * 13.7 + h * 2.1) % (Math.PI * 2));
      const distOffset = (0.2 + ((seed * 7.3 + h * 0.4) % 0.45)) * baseRadius;
      holes.push({
        relX: Math.cos(angleOffset) * distOffset,
        relY: Math.sin(angleOffset) * distOffset,
        radX: baseRadius * (0.04 + ((seed * 11.1 + h) % 0.05)),
        radY: baseRadius * (0.12 + ((seed * 17.9 + h) % 0.12)),
        angle: angleOffset + Math.PI / 4
      });
    }
    return holes;
  }, []);

  // Main rendering loop with ultra-smooth cursor transition & procedural reveal
  useEffect(() => {
    let animationFrameId: number;

    const render = (timeMs: number) => {
      animationFrameId = requestAnimationFrame(render);

      const canvas = canvasRef.current;
      const container = containerRef.current;
      const img1 = image1ElementRef.current;

      if (!canvas || !container || !img1 || !image1Loaded) {
        return;
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetCanvasWidth = Math.round(width * dpr);
      const targetCanvasHeight = Math.round(height * dpr);

      if (canvas.width !== targetCanvasWidth || canvas.height !== targetCanvasHeight) {
        canvas.width = targetCanvasWidth;
        canvas.height = targetCanvasHeight;
      }

      const now = timeMs / 1000;
      const lastTime = lastFrameTimeRef.current || now;
      const dt = Math.min(now - lastTime, 0.05); // Smooth cap against frame stalls
      lastFrameTimeRef.current = now;

      // Cursor follower calculation (approx 17.5% of smaller viewport dimension)
      const smallerDim = Math.min(width, height);
      const baseRadius = smallerDim * 0.175;

      if (isPointerInsideRef.current && targetPosRef.current) {
        const tx = targetPosRef.current.x;
        const ty = targetPosRef.current.y;

        if (!smoothedPosRef.current) {
          // Immediately set follower to cursor position upon first entering
          smoothedPosRef.current = { x: tx, y: ty };
          lastStampPosRef.current = { x: tx, y: ty };
        } else {
          // Buttery smooth frame-rate independent exponential interpolation
          const k = 1 - Math.exp(-22 * dt);
          smoothedPosRef.current.x += (tx - smoothedPosRef.current.x) * k;
          smoothedPosRef.current.y += (ty - smoothedPosRef.current.y) * k;
        }

        const sx = smoothedPosRef.current.x;
        const sy = smoothedPosRef.current.y;

        // Denser stamp placing for seamless, ultra-smooth brush coverage
        const stepDist = baseRadius * 0.055;
        const lastX = lastStampPosRef.current?.x ?? sx;
        const lastY = lastStampPosRef.current?.y ?? sy;
        const dist = Math.hypot(sx - lastX, sy - lastY);

        if (dist >= stepDist) {
          const count = Math.min(Math.floor(dist / stepDist), 32);
          const rawAngle = Math.atan2(sy - lastY, sx - lastX);

          // Smooth angular transition to eliminate sharp direction snaps
          const prevAngle = lastAngleRef.current;
          let angleDiff = rawAngle - prevAngle;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          const targetAngle = prevAngle + angleDiff * 0.45;
          lastAngleRef.current = targetAngle;

          const speed = dist / Math.max(dt, 0.001);
          const stretchX = 1 + Math.min(0.35, speed * 0.0006);
          const stretchY = 1 / Math.sqrt(stretchX);

          for (let i = 1; i <= count; i++) {
            const t = i / count;
            const px = lastX + (sx - lastX) * t;
            const py = lastY + (sy - lastY) * t;
            const currentAngle = prevAngle + angleDiff * t;
            const seed = Math.random() * 1000;

            stampsRef.current.push({
              x: px,
              y: py,
              radius: baseRadius,
              originalRadius: baseRadius,
              angle: currentAngle,
              stretchX,
              stretchY,
              born: now,
              seed,
              holes: generateIrregularHoles(seed, baseRadius)
            });
          }

          lastStampPosRef.current = { x: sx, y: sy };
        }
      }

      // Filter and update stamp life & physical shrinking
      const LIFETIME = 2.7;
      const remainingStamps: BrushStamp[] = [];

      for (let i = 0; i < stampsRef.current.length; i++) {
        const stamp = stampsRef.current[i];
        const age = now - stamp.born;
        if (age < LIFETIME) {
          const t = Math.max(0, 1 - age / LIFETIME);
          // Hermite cubic smoothstep for organic, continuous shrinkage without harsh cutoffs
          const smoothLife = t * t * (3 - 2 * t);
          stamp.radius = stamp.originalRadius * Math.pow(smoothLife, 0.82);
          if (stamp.radius > 0.5) {
            remainingStamps.push(stamp);
          }
        }
      }
      stampsRef.current = remainingStamps;

      // -------------------------------------------------------------
      // DRAWING PASS
      // -------------------------------------------------------------
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Draw IMAGE 1 with identical object-fit: cover coordinate mapping
      const imgW = img1.naturalWidth || width;
      const imgH = img1.naturalHeight || height;
      const imgRatio = imgW / imgH;
      const canvasRatio = width / height;

      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (canvasRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        drawX = 0;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img1, drawX, drawY, drawW, drawH);

      // Only perform reveal mask if there are active brush stamps!
      // Initial state: stamps is empty -> 100% IMAGE 1 visible, 0% reveal!
      if (remainingStamps.length > 0) {
        ctx.globalCompositeOperation = 'destination-out';

        for (let s = 0; s < remainingStamps.length; s++) {
          const stamp = remainingStamps[s];
          const SAMPLES = 48;
          const points: { x: number; y: number }[] = [];

          const cosAngle = Math.cos(stamp.angle);
          const sinAngle = Math.sin(stamp.angle);

          for (let p = 0; p < SAMPLES; p++) {
            const angle = (p / SAMPLES) * Math.PI * 2;

            // Multi-frequency noise with large bumps, medium irregularities, small imperfections & broken edges
            const r = stamp.radius * (
              1 +
              0.085 * Math.sin(3 * angle + stamp.seed) +
              0.048 * Math.sin(5 * angle + stamp.seed * 2.1) +
              0.022 * Math.sin(9 * angle + stamp.seed * 3.7) +
              0.035 * Math.sin(17 * angle + stamp.seed * 5.3) +
              0.015 * Math.sin(31 * angle + stamp.seed * 11.2)
            );

            // Stretch in motion vector direction
            const localX = r * Math.cos(angle) * stamp.stretchX;
            const localY = r * Math.sin(angle) * stamp.stretchY;

            // Rotate by stamp movement angle
            const worldX = stamp.x + localX * cosAngle - localY * sinAngle;
            const worldY = stamp.y + localX * sinAngle + localY * cosAngle;

            points.push({ x: worldX, y: worldY });
          }

          // Smooth closed organic curve using Catmull-Rom to Cubic Bézier conversion
          ctx.beginPath();
          const n = points.length;
          const firstMidX = (points[0].x + points[1].x) / 2;
          const firstMidY = (points[0].y + points[1].y) / 2;
          ctx.moveTo(firstMidX, firstMidY);

          for (let i = 0; i < n; i++) {
            const p0 = points[(i - 1 + n) % n];
            const p1 = points[i];
            const p2 = points[(i + 1) % n];
            const p3 = points[(i + 2) % n];

            // Standard Catmull-Rom cubic control points
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
          }
          ctx.closePath();

          // Draw subtle small elongated irregular holes inside brush strokes (dry-brush scratched texture)
          if (stamp.holes && stamp.holes.length > 0 && stamp.radius > 20) {
            for (let h = 0; h < stamp.holes.length; h++) {
              const hole = stamp.holes[h];
              const scale = stamp.radius / stamp.originalRadius;
              const hRadX = hole.radX * scale;
              const hRadY = hole.radY * scale;

              const holeWorldX = stamp.x + (hole.relX * scale) * cosAngle - (hole.relY * scale) * sinAngle;
              const holeWorldY = stamp.y + (hole.relX * scale) * sinAngle + (hole.relY * scale) * cosAngle;

              // Irregular elongated slit path
              ctx.moveTo(holeWorldX + hRadX, holeWorldY);
              ctx.ellipse(
                holeWorldX,
                holeWorldY,
                Math.max(1, hRadX),
                Math.max(2, hRadY),
                hole.angle + stamp.angle,
                0,
                Math.PI * 2
              );
            }
          }

          // Use 'evenodd' to preserve internal dry-brush bristle holes while wiping away the outer stroke
          ctx.fillStyle = '#000000';
          ctx.fill('evenodd');
        }

        ctx.globalCompositeOperation = 'source-over';
      }

      // Smooth custom cursor follower reticle on canvas
      if (isPointerInsideRef.current && smoothedPosRef.current) {
        const sx = smoothedPosRef.current.x;
        const sy = smoothedPosRef.current.y;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, baseRadius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [image1Loaded, generateIrregularHoles]);

  // Pointer event handlers with high-frequency coalesced micro-movements
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isPointerInsideRef.current = true;
    targetPosRef.current = { x, y };
    smoothedPosRef.current = { x, y };
    lastStampPosRef.current = { x, y };
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Use coalesced events if available for ultra-smooth sub-pixel hardware polling
    const coalescedEvents = (e.nativeEvent as any).getCoalescedEvents
      ? (e.nativeEvent as any).getCoalescedEvents()
      : [e.nativeEvent];

    const lastEvent = coalescedEvents[coalescedEvents.length - 1] || e;
    const x = lastEvent.clientX - rect.left;
    const y = lastEvent.clientY - rect.top;

    if (!isPointerInsideRef.current) {
      isPointerInsideRef.current = true;
      smoothedPosRef.current = { x, y };
      lastStampPosRef.current = { x, y };
    }

    targetPosRef.current = { x, y };
    setHasInteracted(true);
  };

  const handlePointerLeave = () => {
    isPointerInsideRef.current = false;
    targetPosRef.current = null;
    lastStampPosRef.current = null;
  };

  const scrollToContent = () => {
    const el = document.getElementById('resume-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden select-none touch-none bg-[#090a0f]"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerEnter}
    >
      {/* 
        UNDERLYING IMAGE (IMAGE 2)
        Revealed only when IMAGE 1 is scratched away by cursor brush
      */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          ref={bottomImageRef}
          src={image2Url}
          alt="Sri Ramya Studio Portrait"
          className="w-full h-full object-cover object-center pointer-events-none"
          referrerPolicy="no-referrer"
          onLoad={() => setImage2Loaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Lightweight low-opacity particle field providing cosmic/cyber depth */}
        <ParticleField className="opacity-75" particleCount={55} />
      </div>

      {/* 
        TOP CANVAS (IMAGE 1)
        Covers 100% of the screen initially.
        Procedural dry-brush uses destination-out to carve away portions.
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
      />

      {/* 
        IMMERSIVE BRAND & HERO HUD OVERLAY
        (Top header and interactive scratch canvas badge removed per user request)
      */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-6 md:p-12">
        {/* Center Prompt & First interaction guide (dismisses on scratch) */}
        {!hasInteracted && (
          <div className="self-center mb-auto mt-24 text-center max-w-lg bg-black/60 backdrop-blur-lg border border-cyan-500/30 p-6 rounded-xl shadow-2xl animate-fade-in pointer-events-auto">
            <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              <span className="text-xs uppercase tracking-widest font-mono font-semibold">
                Real-Time Scratch Reveal
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 font-display">
              Move Cursor to Scratch & Wipe
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Drag your cursor or finger across the image to tear away the cyber holographic matrix with an organic dry brush, revealing the human engineer underneath.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Procedural 48-point spline</span>
              <span>·</span>
              <span>Physical 2.7s shrink</span>
            </div>
          </div>
        )}

        {/* Bottom Bar: Hero Title & Clean Interactive Controls */}
        <div className="flex flex-col md:flex-row items-end md:items-end justify-between gap-6 w-full">
          {/* Hero Typography */}
          <div className="max-w-xl pointer-events-auto bg-black/50 backdrop-blur-md p-6 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
              <span>Full Stack Development Intern</span>
              <span>·</span>
              <span>B.Tech AI & ML</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
              Sri Ramya
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 font-sans leading-relaxed">
              Bridging scalable software architecture and applied artificial intelligence. Scratch the canvas to peel back the layers between code and craft.
            </p>
          </div>

          {/* Clean Controls Cluster without top header or swap button */}
          <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
            {onOpenPdfModal && (
              <MagneticElement strength={0.3}>
                <button
                  onClick={onOpenPdfModal}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-black/60 backdrop-blur-md border border-white/15 rounded-lg hover:bg-black/80 hover:border-cyan-500/50 transition-colors shadow-lg"
                  title="View and download official curriculum vitae"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resume PDF</span>
                </button>
              </MagneticElement>
            )}

            {onOpenContactModal && (
              <MagneticElement strength={0.3}>
                <button
                  onClick={onOpenContactModal}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-black/60 backdrop-blur-md border border-white/15 rounded-lg hover:bg-black/80 hover:border-cyan-500/50 transition-colors shadow-lg"
                  title="Contact Sri Ramya"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Contact</span>
                </button>
              </MagneticElement>
            )}

            <MagneticElement strength={0.3}>
              <button
                onClick={onOpenImageModal}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-black/60 backdrop-blur-md border border-white/15 rounded-lg hover:bg-black/80 hover:border-cyan-500/50 transition-colors shadow-lg"
                title="Upload your own custom images or choose presets"
              >
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Custom Images</span>
              </button>
            </MagneticElement>

            <MagneticElement strength={0.35}>
              <button
                onClick={scrollToContent}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
              >
                <span>Explore Resume</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            </MagneticElement>
          </div>
        </div>
      </div>
    </section>
  );
};
