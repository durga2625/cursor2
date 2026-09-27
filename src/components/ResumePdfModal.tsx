import React from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import {
  PERSONAL_INFO,
  EDUCATION_LIST,
  EXPERIENCE_LIST,
  PROJECTS_LIST,
  TECH_SKILLS,
  CERTIFICATIONS_LIST,
  ACHIEVEMENTS
} from '../data/resumeData';

interface ResumePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumePdfModal: React.FC<ResumePdfModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div 
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none print:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Official Curriculum Vitae</span>
            <span>·</span>
            <span>Sri Ramya</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Body - Exact structure as uploaded document */}
        <div className="space-y-6 text-slate-800 text-sm font-sans">
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-slate-300 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 font-display">
              {PERSONAL_INFO.name}
            </h1>
            <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-3">
              <span>{PERSONAL_INFO.location}</span>
              <span aria-hidden="true">|</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-900 font-medium hover:underline">
                {PERSONAL_INFO.email}
              </a>
              <span aria-hidden="true">|</span>
              <span className="tabular-nums">{PERSONAL_INFO.phone}</span>
            </div>
            <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-3 font-mono pt-1">
              <span>LeetCode: Sriramya Buradakavi</span>
              <span aria-hidden="true">|</span>
              <span>LinkedIn: sriramya buradakavi</span>
              <span aria-hidden="true">|</span>
              <span>HackerRank: sriramyaburadak1</span>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1">
              Education
            </h2>
            <div className="space-y-2.5">
              {EDUCATION_LIST.map((edu, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {edu.institution}, <span className="font-normal text-slate-600">{edu.location}</span>
                    </div>
                    <div className="text-slate-700">
                      • {edu.degree} ({edu.grade})
                    </div>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5 sm:mt-0">
                    {edu.period}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1">
              Professional Experience
            </h2>
            {EXPERIENCE_LIST.map((exp, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="font-semibold text-slate-900">
                    {exp.role}, <span className="font-normal text-slate-700">{exp.company} – {exp.location}</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    {exp.period}
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed pl-1">
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1">
              Projects
            </h2>
            <div className="space-y-3 text-xs">
              {PROJECTS_LIST.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="font-semibold text-slate-900">
                    {proj.title} — <span className="font-normal text-slate-600 font-mono">{proj.tech.join(', ')}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 leading-relaxed pl-1">
                    {proj.features.map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1">
              Technologies
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Programming Languages:</span> C, Python, Java, JavaScript, HTML5, CSS3
              </div>
              <div>
                <span className="font-semibold text-slate-900">Databases:</span> MySQL
              </div>
              <div>
                <span className="font-semibold text-slate-900">Cloud Platforms:</span> AWS (S3, VPC, IAM, Certificate Manager, CloudFront)
              </div>
              <div>
                <span className="font-semibold text-slate-900">Tools, IDEs:</span> Git, GitHub, Jupyter Notebook, VS Code
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1">
              Certifications
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
              {CERTIFICATIONS_LIST.map((cert, idx) => (
                <li key={idx}>
                  <span className="font-medium text-slate-900">{cert.title}</span> – {cert.issuer} ({cert.year})
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements & Awards */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1">
              Achievements & Awards
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
              <li>Earned 5-star golden badges in C and MySQL, and 3-star badges in Java and Python on HackerRank.</li>
              <li>Solved 100+ problems on LeetCode, demonstrating strong algorithmic problem-solving ability.</li>
              <li>Recognized as a 1-star coder on CodeChef.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
