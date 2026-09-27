import React, { useState } from 'react';
import {
  PERSONAL_INFO,
  EDUCATION_LIST,
  EXPERIENCE_LIST,
  PROJECTS_LIST,
  TECH_SKILLS,
  CERTIFICATIONS_LIST,
  ACHIEVEMENTS
} from '../data/resumeData';
import { ProjectData } from '../types';
import { CertificationsSpin3D } from './CertificationsSpin3D';
import { ProjectCard } from './ProjectCard';
import { FadeInSection } from './FadeInSection';
import {
  ExternalLink,
  Code2,
  Terminal,
  Database,
  Cloud,
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  Send
} from 'lucide-react';

interface ResumeSectionProps {
  onSelectProject: (project: ProjectData) => void;
  onOpenPdfModal: () => void;
  onOpenContactModal: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  onSelectProject,
  onOpenPdfModal,
  onOpenContactModal
}) => {
  const [skillCategory, setSkillCategory] = useState<'all' | 'languages' | 'cloud' | 'databases'>('all');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      contactSubject || `Inquiry for Sri Ramya from ${contactName || 'Portfolio Visitor'}`
    );
    const body = encodeURIComponent(
      `${contactMessage}\n\n---\nFrom: ${contactName} (${contactEmail})`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  const handleOpenGmail = () => {
    const subject = encodeURIComponent(
      contactSubject || `Inquiry for Sri Ramya from ${contactName || 'Portfolio Visitor'}`
    );
    const body = encodeURIComponent(
      `${contactMessage}\n\n---\nFrom: ${contactName} (${contactEmail})`
    );
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${PERSONAL_INFO.email}&su=${subject}&body=${body}`,
      '_blank',
      'noopener,noreferrer'
    );
    setFormSent(true);
  };

  return (
    <div id="resume-overview" className="bg-[#090a0f] text-slate-100 min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-32">

        {/* ---------------------------------------------------- */}
        {/* 01. EXECUTIVE SUMMARY & QUANTITATIVE RIGOR           */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <section id="about" className="pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>01</span>
                  <span aria-hidden="true">/</span>
                  <span>Executive Overview</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
                  Architecting intelligent interfaces and scalable backend systems.
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
                  {PERSONAL_INFO.summary}
                </p>
                
                <div className="pt-4 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-200">{PERSONAL_INFO.location}</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Email:</span>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="text-cyan-400 hover:underline">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Phone:</span>
                    <span className="text-slate-200 tabular-nums">{PERSONAL_INFO.phone}</span>
                  </div>
                </div>

                {/* Profiles - clean text with separators */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2">
                  <a
                    href={PERSONAL_INFO.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors py-1"
                  >
                    <span>LeetCode Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span aria-hidden="true" className="text-slate-700">/</span>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors py-1"
                  >
                    <span>LinkedIn Network</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span aria-hidden="true" className="text-slate-700">/</span>
                  <a
                    href={PERSONAL_INFO.hackerrank}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors py-1"
                  >
                    <span>HackerRank Accolades</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Adjacent Proof Metrics Grid */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#121520] border border-[#232738] rounded-xl hover:border-cyan-500/40 transition-colors"
                  >
                    <span className="text-xs text-cyan-400 font-mono block mb-1">
                      {ach.label}
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-white font-display tabular-nums">
                      {ach.metric}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {ach.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ---------------------------------------------------- */}
        {/* 02. PROFESSIONAL EXPERIENCE & EDUCATION              */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <section id="experience" className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232738] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span>02</span>
                  <span aria-hidden="true">/</span>
                  <span>Work History & Academic Foundations</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-display">
                  Professional Experience
                </h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Practical engineering experience in Agile full-stack software development, UI systems, and backend services.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Experience Card */}
              <div className="lg:col-span-7 space-y-6">
                {EXPERIENCE_LIST.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-8 bg-[#121520] border border-[#232738] rounded-2xl space-y-6 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white font-display">
                          {exp.role}
                        </h3>
                        <div className="text-sm text-cyan-400 mt-0.5">
                          {exp.company}
                          <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
                          <span className="text-slate-400">{exp.location}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-3 text-sm text-slate-300 font-sans">
                      {exp.highlights.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Clean unboxed skill metadata */}
                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-500 font-mono">Tech Applied:</span>
                      {exp.skills.map((s, sIdx) => (
                        <React.Fragment key={s}>
                          <span>{s}</span>
                          {sIdx < exp.skills.length - 1 && <span aria-hidden="true" className="text-slate-700">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Education Track */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Education Background</span>
                </h3>

                {EDUCATION_LIST.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-[#121520] border border-[#232738] rounded-xl hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500 tabular-nums">
                        {edu.period}
                      </span>
                      <span className="text-xs font-semibold text-cyan-400 font-mono tabular-nums">
                        {edu.grade}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white font-display">
                      {edu.degree}
                    </h4>
                    <div className="text-xs text-slate-400">
                      {edu.institution}
                      <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                      <span>{edu.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ---------------------------------------------------- */}
        {/* 03. CERTIFICATIONS & HONORS (MIDDLE)                 */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <section id="credentials" className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232738] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span>03</span>
                  <span aria-hidden="true">/</span>
                  <span>Verified Credentials & Accolades</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-display">
                  Certifications & Achievements
                </h2>
              </div>
              <button
                onClick={onOpenPdfModal}
                className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Download Official Resume Document</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <CertificationsSpin3D onOpenPdfModal={onOpenPdfModal} />
          </section>
        </FadeInSection>

        {/* ---------------------------------------------------- */}
        {/* 04. TECHNICAL SKILLS & CAPABILITIES                  */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <section id="skills" className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232738] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span>04</span>
                  <span aria-hidden="true">/</span>
                  <span>Tooling & Systems Architecture</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-display">
                  Technologies & Competencies
                </h2>
              </div>
              
              {/* Functional Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#121520] border border-[#232738] rounded-lg">
                <button
                  onClick={() => setSkillCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    skillCategory === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Domains
                </button>
                <button
                  onClick={() => setSkillCategory('languages')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    skillCategory === 'languages'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Languages
                </button>
                <button
                  onClick={() => setSkillCategory('cloud')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    skillCategory === 'cloud'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  AWS & Cloud
                </button>
                <button
                  onClick={() => setSkillCategory('databases')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    skillCategory === 'databases'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Databases
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Programming Languages */}
              {(skillCategory === 'all' || skillCategory === 'languages') && (
                <div className="p-6 bg-[#121520] border border-[#232738] rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Terminal className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                      Languages
                    </h3>
                  </div>
                  <div className="space-y-3 font-sans">
                    {TECH_SKILLS.languages.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-xs font-mono text-slate-500">{item.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cloud & DevOps */}
              {(skillCategory === 'all' || skillCategory === 'cloud') && (
                <div className="p-6 bg-[#121520] border border-[#232738] rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Cloud className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                      AWS Infrastructure
                    </h3>
                  </div>
                  <div className="space-y-3 font-sans">
                    {TECH_SKILLS.cloudAndDevOps.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-xs font-mono text-slate-500">{item.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Databases & Storage */}
              {(skillCategory === 'all' || skillCategory === 'databases') && (
                <div className="p-6 bg-[#121520] border border-[#232738] rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Database className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                      Databases
                    </h3>
                  </div>
                  <div className="space-y-3 font-sans">
                    {TECH_SKILLS.databases.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-xs font-mono text-slate-500">{item.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tooling & IDEs */}
              {skillCategory === 'all' && (
                <div className="p-6 bg-[#121520] border border-[#232738] rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Code2 className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                      Tools & Environments
                    </h3>
                  </div>
                  <div className="space-y-3 font-sans">
                    {TECH_SKILLS.toolsAndIDEs.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-xs font-mono text-slate-500">{item.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </FadeInSection>

        {/* ---------------------------------------------------- */}
        {/* 05. FEATURED PROJECTS DEEP DIVE (AT LAST)            */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <section id="projects" className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232738] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span>05</span>
                  <span aria-hidden="true">/</span>
                  <span>Production & Academic Software</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-display">
                  Featured Engineering Projects
                </h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Full-lifecycle web applications featuring drag-and-drop orchestration, RESTful API integration, and database normalization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {PROJECTS_LIST.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onSelect={onSelectProject}
                />
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* ---------------------------------------------------- */}
        {/* 06. CONTACT & COLLABORATION                          */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <section id="contact" className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232738] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span>06</span>
                  <span aria-hidden="true">/</span>
                  <span>Direct Communication & Opportunities</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-display">
                  Get in Touch
                </h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Have an internship role, collaborative project, or engineering inquiry? Reach out directly via email, phone, or the message composer.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Direct Info Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-[#121520] border border-[#232738] rounded-2xl space-y-4 shadow-lg">
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Direct Coordinates</span>
                  </h3>

                  {/* Email */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Address</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                        title="Copy email to clipboard"
                      >
                        {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'email' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors block truncate"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Phone / WhatsApp</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                        title="Copy phone to clipboard"
                      >
                        {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'phone' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <a
                      href={`tel:${PERSONAL_INFO.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors block tabular-nums"
                    >
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>

                  {/* Location */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Current Location</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      {PERSONAL_INFO.location}
                    </div>
                  </div>
                </div>

                {/* Profiles & Accolades */}
                <div className="p-6 bg-[#121520] border border-[#232738] rounded-2xl space-y-3">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Engineering Profiles
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <a
                      href={PERSONAL_INFO.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-300 text-slate-300 transition-all flex items-center justify-between"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                    <a
                      href={PERSONAL_INFO.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-300 text-slate-300 transition-all flex items-center justify-between"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                    <a
                      href={PERSONAL_INFO.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-300 text-slate-300 transition-all flex items-center justify-between"
                    >
                      <span>LeetCode</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                    <a
                      href={PERSONAL_INFO.hackerrank}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-300 text-slate-300 transition-all flex items-center justify-between"
                    >
                      <span>HackerRank</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Message Form */}
              <div className="lg:col-span-7">
                <div className="p-8 bg-[#121520] border border-[#232738] rounded-2xl space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">
                        Send a Message
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Drafts directly to <span className="text-cyan-400 font-mono">{PERSONAL_INFO.email}</span> with pre-filled parameters.
                      </p>
                    </div>
                    <button
                      onClick={onOpenContactModal}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Popout Modal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {formSent && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
                        <Check className="w-4 h-4" />
                        <span>Email application invoked!</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Your message has been passed to your default email client. You can also open the draft directly in Gmail or send to {PERSONAL_INFO.email}.
                      </p>
                      <button
                        onClick={handleOpenGmail}
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono pt-1"
                      >
                        <span>Open draft in Gmail Web</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="jane@company.com"
                          className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Internship / Engineering Inquiry"
                        className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Hi Sri Ramya, I came across your portfolio and would like to connect regarding an engineering role or technical collaboration..."
                        className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="submit"
                        className="py-3 px-5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Launch Mail Client</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenGmail}
                        className="py-3 px-5 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Open in Gmail Web</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ---------------------------------------------------- */}
        {/* FOOTER CALL TO ACTION                                */}
        {/* ---------------------------------------------------- */}
        <FadeInSection>
          <div className="pt-16 border-t border-[#232738] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
            <div>
              <span className="font-semibold text-white font-display text-sm block">
                {PERSONAL_INFO.name}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                B.Tech Artificial Intelligence & Machine Learning · Surampalem, AP
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onOpenPdfModal}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Official Resume PDF
              </button>
              <span>·</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </FadeInSection>

      </div>
    </div>
  );
};
