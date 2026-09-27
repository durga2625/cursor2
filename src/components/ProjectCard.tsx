import React, { useRef, useState } from 'react';
import { ProjectData } from '../types';
import { ChevronRight, Sparkles, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onSelect: (project: ProjectData) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates between -1 and 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Subtle 3D tilt and magnetic attraction translation toward cursor
    setRotateX(-normY * 7);
    setRotateY(normX * 7);
    setMagneticOffset({ x: normX * 8, y: normY * 8 });
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setMagneticOffset({ x: 0, y: 0 });
  };

  // Staggered continuous floating animation class
  const floatClass = index % 2 === 0 ? 'animate-float-1' : 'animate-float-2';

  return (
    <div
      ref={cardRef}
      data-project-card="true"
      data-magnetic="true"
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative cursor-pointer select-none rounded-2xl transition-all duration-300 ease-out ${
        isHovered ? '' : floatClass
      }`}
      style={{
        perspective: '1000px',
        willChange: 'transform'
      }}
    >
      {/* Outer Floating Glow Shadow */}
      <div 
        className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-purple-500/25 blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-80 scale-105' : 'opacity-20 scale-100'
        }`}
      />

      {/* Main 3D Card Shell */}
      <div
        className="relative h-full p-8 rounded-2xl bg-[#121520] border border-[#232738] group-hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered 
            ? `translate3d(${magneticOffset.x}px, ${magneticOffset.y - 12}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)` 
            : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(6, 182, 212, 0.25), 0 0 30px rgba(6, 182, 212, 0.1)' 
            : '0 12px 30px -10px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Specular Interactive Cursor Spotlight Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: isHovered
              ? `radial-gradient(circle 320px at ${glowPos.x}% ${glowPos.y}%, rgba(6, 182, 212, 0.14), transparent 80%)`
              : 'transparent',
            opacity: isHovered ? 1 : 0
          }}
        />

        {/* Top Header Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{project.timeline}</span>
            </span>

            <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1.5 transition-transform duration-300">
              <span>View Specifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white font-display group-hover:text-cyan-300 transition-colors duration-200">
            {project.title}
          </h3>
          <div className="text-xs text-slate-400 mt-1 mb-4 font-mono">
            {project.subtitle}
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Bottom Capabilities & Stack */}
        <div className="relative z-10 space-y-4 pt-4 border-t border-white/5">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-mono block">Core Capabilities:</span>
            <ul className="text-xs text-slate-300 space-y-1.5 font-sans">
              {project.features.slice(0, 2).map((feat, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-2 font-mono">
            {project.tech.map((t, tIdx) => (
              <React.Fragment key={t}>
                <span className="text-slate-300 bg-black/30 px-2 py-0.5 rounded-md border border-white/5">
                  {t}
                </span>
                {tIdx < project.tech.length - 1 && <span aria-hidden="true" className="text-slate-700">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
