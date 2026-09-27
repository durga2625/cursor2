import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Copy, Check, Send, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/resumeData';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const constructMailtoUrl = () => {
    const emailSubject = encodeURIComponent(
      subject || `Engineering Opportunity / Inquiry for Sri Ramya from ${senderName || 'Portfolio Visitor'}`
    );
    const emailBody = encodeURIComponent(
      `${message}\n\n---\nSender: ${senderName || 'Anonymous'}\nContact: ${senderEmail || 'Not provided'}`
    );
    return `mailto:${PERSONAL_INFO.email}?subject=${emailSubject}&body=${emailBody}`;
  };

  const constructGmailUrl = () => {
    const emailSubject = encodeURIComponent(
      subject || `Engineering Opportunity / Inquiry for Sri Ramya from ${senderName || 'Portfolio Visitor'}`
    );
    const emailBody = encodeURIComponent(
      `${message}\n\n---\nSender: ${senderName || 'Anonymous'}\nContact: ${senderEmail || 'Not provided'}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${PERSONAL_INFO.email}&su=${emailSubject}&body=${emailBody}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = constructMailtoUrl();
    window.location.href = mailto;
    setFormSent(true);
  };

  const handleOpenGmail = () => {
    const gmailUrl = constructGmailUrl();
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setFormSent(true);
  };

  const handleResetForm = () => {
    setSenderName('');
    setSenderEmail('');
    setSubject('');
    setMessage('');
    setFormSent(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#121520] border border-[#232738] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Communication Channel</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Get in Touch with Sri Ramya
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Available for full stack engineering internships and AI/ML projects.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Direct Contact Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-200 truncate pr-2">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{PERSONAL_INFO.email}</span>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono shrink-0 pl-1"
              title="Copy Email Address"
            >
              {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'email' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="tabular-nums">{PERSONAL_INFO.phone}</span>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono shrink-0"
              title="Copy Phone Number"
            >
              {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'phone' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Success Confirmation Toast */}
        {formSent && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 animate-fade-in text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <Check className="w-4 h-4" />
              <span>Email client invoked successfully!</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your message was prepared for <span className="text-cyan-300 font-mono">{PERSONAL_INFO.email}</span>. You can also copy your message or draft directly in Gmail Web below.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleOpenGmail}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Open in Gmail Web</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={handleResetForm}
                className="text-slate-400 hover:text-white font-mono text-[11px]"
              >
                Compose New Message
              </button>
            </div>
          </div>
        )}

        {/* Message Form */}
        <form onSubmit={handleSendMessage} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-mono block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-mono block mb-1">Your Email *</label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-mono block mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Full Stack Engineering Opportunity"
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-mono block mb-1">Message *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi Sri Ramya, I came across your portfolio and would like to connect regarding an engineering role or technical collaboration..."
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            />
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Default Mail App</span>
            </button>

            <button
              type="button"
              onClick={handleOpenGmail}
              className="w-full py-2.5 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open in Gmail Web</span>
            </button>
          </div>
        </form>

        {/* Social / Technical Verification Links */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <span className="text-[11px] text-slate-500">Professional Networks:</span>
          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <a
              href={PERSONAL_INFO.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>LeetCode</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
