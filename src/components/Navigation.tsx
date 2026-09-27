import React from 'react';
import { FileText, Mail } from 'lucide-react';

interface NavigationProps {
  onOpenPdfModal: () => void;
  onOpenContactModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenPdfModal,
  onOpenContactModal
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#090a0f]/80 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors font-display whitespace-nowrap"
        >
          Buradakavi Sri Ramya
        </a>

        {/* Zone 2: 4–6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            About
          </a>
          <a href="#experience" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Experience
          </a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Projects
          </a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Skills
          </a>
          <a href="#credentials" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Credentials
          </a>
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPdfModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resume PDF</span>
          </button>
          
          <button
            onClick={onOpenContactModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
