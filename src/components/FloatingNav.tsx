import React, { useState, useEffect } from 'react';
import { Sparkles, User, Briefcase, FolderCode, Terminal, Award, FileText, ArrowUp, Mail } from 'lucide-react';
import { MagneticElement } from './MagneticElement';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FloatingNavProps {
  onOpenPdfModal?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Intro', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'about', label: 'About', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'credentials', label: 'Credentials', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'skills', label: 'Skills', icon: <Terminal className="w-3.5 h-3.5" /> },
  { id: 'projects', label: 'Projects', icon: <FolderCode className="w-3.5 h-3.5" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> }
];

export const FloatingNav: React.FC<FloatingNavProps> = ({ onOpenPdfModal }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      const heroHeight = window.innerHeight * 0.5;

      // Show/hide dock or adjust prominence based on scroll
      setHasScrolledPastHero(window.scrollY > heroHeight);

      // Find the active section based on scroll offsets
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            return;
          }
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Floating page navigation"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out select-none ${
        hasScrolledPastHero 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 bg-[#121520]/85 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/80">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <MagneticElement key={item.id} strength={0.3}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/20 shadow-sm shadow-cyan-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={`Scroll to ${item.label}`}
              >
                {item.icon}
                <span className="hidden md:inline font-mono text-[11px] tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </button>
            </MagneticElement>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block" />

        {/* Quick Back to Top */}
        <MagneticElement strength={0.35}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-1.5 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
            title="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </MagneticElement>

        {/* PDF Shortcut button in dock */}
        {onOpenPdfModal && (
          <MagneticElement strength={0.3}>
            <button
              onClick={onOpenPdfModal}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="Open Resume PDF"
            >
              <FileText className="w-3 h-3 text-cyan-400" />
              <span className="font-mono text-[11px]">PDF</span>
            </button>
          </MagneticElement>
        )}
      </div>
    </nav>
  );
};
