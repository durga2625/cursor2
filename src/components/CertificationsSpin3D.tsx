import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CERTIFICATIONS_LIST } from '../data/resumeData';
import { CertificationData } from '../types';
import { Award, Cloud, Code, Database, Globe, Play, Pause, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificationsSpin3DProps {
  onOpenPdfModal?: () => void;
}

export const CertificationsSpin3D: React.FC<CertificationsSpin3DProps> = ({ onOpenPdfModal }) => {
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(0.35); // degrees per frame
  const [selectedCert, setSelectedCert] = useState<CertificationData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const [viewMode, setViewMode] = useState<'3d-spin' | 'grid'>('3d-spin');
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Responsive radius for 3D carousel
  const [radius, setRadius] = useState(300);

  useEffect(() => {
    const updateRadius = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setRadius(210); // Compact on mobile
        } else if (window.innerWidth < 1024) {
          setRadius(270);
        } else {
          setRadius(340); // Generous 3D depth on desktop
        }
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Continuous buttery-smooth autospin loop
  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min((time - lastTimeRef.current) / 16.667, 2.5); // normalized frame rate
      lastTimeRef.current = time;

      if (isPlaying && !isDragging && !isHovered && viewMode === '3d-spin') {
        setRotation((prev) => (prev + speed * delta) % 360);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, isDragging, isHovered, speed, viewMode]);

  // Touch and Mouse drag to manually rotate the 3D ring
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== '3d-spin') return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartRotation(rotation);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || viewMode !== '3d-spin') return;
    const deltaX = e.clientX - dragStartX;
    setRotation(dragStartRotation + deltaX * 0.45);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Icon mapping for each credential
  const getCertIcon = (category: string) => {
    switch (category) {
      case 'Cloud & AI':
        return <Cloud className="w-5 h-5 text-cyan-400" />;
      case 'Programming & DB':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'Web Development':
        return <Code className="w-5 h-5 text-emerald-400" />;
      default:
        return <Award className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Cloud & AI':
        return 'bg-cyan-500/15 text-cyan-300';
      case 'Programming & DB':
        return 'bg-amber-500/15 text-amber-300';
      case 'Web Development':
        return 'bg-emerald-500/15 text-emerald-300';
      default:
        return 'bg-cyan-500/15 text-cyan-300';
    }
  };

  return (
    <div className="w-full space-y-8 select-none">
      {/* Interactive Controls Bar - Clean borderless */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#121520] rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 rounded-lg text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>All 5 Visible & Auto-Spinning in 3D</span>
          </div>
          
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            title={isPlaying ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isPlaying ? 'Pause Spin' : 'Play Spin'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed controls */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg text-xs font-mono">
            <span className="text-slate-500 px-2">Speed:</span>
            <button
              onClick={() => setSpeed(0.2)}
              className={`px-2 py-0.5 rounded ${speed === 0.2 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeed(0.35)}
              className={`px-2 py-0.5 rounded ${speed === 0.35 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(0.7)}
              className={`px-2 py-0.5 rounded ${speed === 0.7 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              2x
            </button>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg text-xs font-mono">
            <button
              onClick={() => setViewMode('3d-spin')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === '3d-spin' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3D Orbit
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Standard Grid
            </button>
          </div>
        </div>
      </div>

      {/* 3D Orbiting Stage - No outline border */}
      {viewMode === '3d-spin' ? (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full h-[460px] sm:h-[490px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#101422] via-[#0c0f18] to-[#090a0f] cursor-grab active:cursor-grabbing shadow-inner"
          style={{ perspective: '1100px' }}
        >
          {/* Center glow core */}
          <div className="absolute w-36 h-36 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* 3D Rotating Assembly */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(-6deg)'
            }}
          >
            {CERTIFICATIONS_LIST.map((cert, index) => {
              // 5 cards evenly distributed around 360 degrees: 0, 72, 144, 216, 288 deg
              const angle = index * (360 / CERTIFICATIONS_LIST.length);
              const totalAngle = (angle + rotation) % 360;
              const rad = (totalAngle * Math.PI) / 180;
              const depth = Math.cos(rad);
              const scale = 0.85 + (depth + 1) * 0.12;
              const opacity = 0.72 + (depth + 1) * 0.14;
              const zIndex = Math.round((depth + 1) * 50);

              return (
                <div
                  key={cert.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCert(cert);
                  }}
                  className="absolute w-[260px] sm:w-[280px] h-[220px] p-6 rounded-2xl backdrop-blur-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle + rotation}deg) translateZ(${radius}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                    backgroundColor: depth > 0.4 ? 'rgba(19, 23, 36, 0.94)' : 'rgba(15, 18, 28, 0.88)',
                    boxShadow: depth > 0.4 
                      ? '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.15)' 
                      : '0 12px 30px -5px rgba(0, 0, 0, 0.65)'
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-black/40">
                        {getCertIcon(cert.category)}
                      </div>
                      <span className={`text-[11px] font-mono px-3 py-0.5 rounded-full ${getBadgeColor(cert.category)}`}>
                        {cert.year}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                      {cert.category}
                    </span>

                    <h4 className="text-sm sm:text-base font-bold text-white font-display line-clamp-2 leading-snug">
                      {cert.title}
                    </h4>
                  </div>

                  {/* Card Footer - Seamless without border */}
                  <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate pr-2">By {cert.issuer}</span>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0 flex items-center gap-1 group-hover:underline">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Alternate Standard Grid - Borderless */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {CERTIFICATIONS_LIST.map((cert) => (
            <div
              key={cert.title}
              onClick={() => setSelectedCert(cert)}
              className="p-6 bg-[#121520] rounded-xl hover:bg-[#161a29] transition-colors space-y-4 cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCertIcon(cert.category)}
                  <span className="text-xs font-mono text-cyan-400">
                    {cert.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {cert.year}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display">
                {cert.title}
              </h3>
              <div className="text-xs text-slate-400 font-sans flex items-center justify-between pt-2">
                <span>Issued by {cert.issuer}</span>
                <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certification Details Drawer / Dialog */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#121520] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-black/40">
                  {getCertIcon(selectedCert.category)}
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 block mb-0.5">
                    Verified Credential · {selectedCert.year}
                  </span>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedCert.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-4 bg-black/30 rounded-xl space-y-2">
                <div className="text-xs font-mono text-slate-400">Issuing Authority:</div>
                <div className="text-base font-semibold text-white">{selectedCert.issuer}</div>
                <div className="text-xs text-slate-400">
                  Accredited curriculum verifying competencies in {selectedCert.category.toLowerCase()} and production-grade engineering principles.
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Verified academic & industry certification on curriculum records.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              {onOpenPdfModal && (
                <button
                  onClick={() => {
                    setSelectedCert(null);
                    onOpenPdfModal();
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  View in Official Resume PDF →
                </button>
              )}
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors ml-auto"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
