import React, { useRef } from 'react';
import { X, Upload, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react';

interface CustomImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image1Url: string;
  image2Url: string;
  defaultImage1: string;
  defaultImage2: string;
  onUpdateImages: (img1: string, img2: string) => void;
  onSwapImages: () => void;
}

export const CustomImageModal: React.FC<CustomImageModalProps> = ({
  isOpen,
  onClose,
  image1Url,
  image2Url,
  defaultImage1,
  defaultImage2,
  onUpdateImages,
  onSwapImages
}) => {
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isTop: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (isTop) {
          onUpdateImages(dataUrl, image2Url);
        } else {
          onUpdateImages(image1Url, dataUrl);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaults = () => {
    onUpdateImages(defaultImage1, defaultImage2);
  };

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
              <span>Image Pair Configuration</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Configure Hero Scratch Layers
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload custom matching images or switch layer ordering.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The scratch reveal works best with two matching images sharing identical dimensions, perspective, and subject positioning. When you scratch IMAGE 1, it physically carves a dry-brush path revealing IMAGE 2 underneath.
          </p>
        </div>

        {/* Current Image Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* IMAGE 1 (TOP) */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                IMAGE 1 (Default / Top)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Scratched away</span>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 border border-white/5 relative">
              <img
                src={image1Url}
                alt="Image 1 preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <input
              type="file"
              ref={fileInput1Ref}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, true)}
            />
            <button
              onClick={() => fileInput1Ref.current?.click()}
              className="w-full py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Custom Image 1</span>
            </button>
          </div>

          {/* IMAGE 2 (BOTTOM) */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                IMAGE 2 (Hidden / Bottom)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Revealed underneath</span>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 border border-white/5 relative">
              <img
                src={image2Url}
                alt="Image 2 preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <input
              type="file"
              ref={fileInput2Ref}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, false)}
            />
            <button
              onClick={() => fileInput2Ref.current?.click()}
              className="w-full py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Custom Image 2</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={onSwapImages}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Swap Layers (Top ↔ Bottom)</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
