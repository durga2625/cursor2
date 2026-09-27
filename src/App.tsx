import React, { useState } from 'react';
import { ScratchHero } from './components/ScratchHero';
import { ResumeSection } from './components/ResumeSection';
import { FloatingNav } from './components/FloatingNav';
import { MagneticCursor } from './components/MagneticCursor';
import { ProjectModal } from './components/ProjectModal';
import { CustomImageModal } from './components/CustomImageModal';
import { ResumePdfModal } from './components/ResumePdfModal';
import { ContactModal } from './components/ContactModal';
import { ProjectData } from './types';
import defaultHero1 from './assets/images/hero_portrait_1.png';
import defaultHero2 from './assets/images/hero_portrait_2.png';

// Default generated matching pair
const DEFAULT_IMAGE_1 = defaultHero1; // Cyber matrix
const DEFAULT_IMAGE_2 = defaultHero2; // Clean studio

export default function App() {
  const [image1Url, setImage1Url] = useState<string>(DEFAULT_IMAGE_1);
  const [image2Url, setImage2Url] = useState<string>(DEFAULT_IMAGE_2);

  // Modal states
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Swap layers between top (IMAGE 1) and bottom (IMAGE 2)
  const handleSwapImages = () => {
    setImage1Url((prev1) => {
      const prev2 = image2Url;
      setImage2Url(prev1);
      return prev2;
    });
  };

  const handleUpdateImages = (img1: string, img2: string) => {
    setImage1Url(img1);
    setImage2Url(img2);
  };

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Main Full-Screen Scratch Reveal Hero (100vw, 100vh) */}
      <main>
        <ScratchHero
          image1Url={image1Url}
          image2Url={image2Url}
          onOpenImageModal={() => setIsImageModalOpen(true)}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />

        {/* Cohesive Resume & Portfolio Content */}
        <ResumeSection
          onSelectProject={(project) => setSelectedProject(project)}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />
      </main>

      {/* Floating Scroll-Spy Navigation Menu */}
      <FloatingNav onOpenPdfModal={() => setIsPdfModalOpen(true)} />

      {/* Global Magnetic Fluid Cursor */}
      <MagneticCursor />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CustomImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        image1Url={image1Url}
        image2Url={image2Url}
        defaultImage1={DEFAULT_IMAGE_1}
        defaultImage2={DEFAULT_IMAGE_2}
        onUpdateImages={handleUpdateImages}
        onSwapImages={handleSwapImages}
      />

      <ResumePdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
