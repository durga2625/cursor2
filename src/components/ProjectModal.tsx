import React from 'react';
import { ProjectData } from '../types';
import { X, CheckCircle, ExternalLink, Code2, Sparkles, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#121520] border border-[#232738] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Project Specification</span>
              <span aria-hidden="true">·</span>
              <span>{project.timeline}</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              {project.title}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {project.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400">
            System Overview
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {project.description}
          </p>
        </div>

        {/* Feature Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400">
            Key Architectural Modules
          </h4>
          <div className="space-y-2.5">
            {project.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-black/30 border border-white/5 rounded-lg text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metric */}
        <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold">Measurable Impact & User Outcomes</span>
          </div>
          <p className="text-xs text-cyan-200/90 leading-relaxed">
            {project.impact}
          </p>
        </div>

        {/* Technology Stack */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-slate-500">Stack:</span>
          {project.tech.map((t, idx) => (
            <React.Fragment key={t}>
              <span className="text-slate-200">{t}</span>
              {idx < project.tech.length - 1 && <span aria-hidden="true" className="text-slate-700">·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
