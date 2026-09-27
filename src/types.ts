export interface BrushStamp {
  x: number;
  y: number;
  radius: number;
  originalRadius: number;
  angle: number;
  stretchX: number;
  stretchY: number;
  born: number; // performance.now() or timestamp in seconds
  seed: number;
  holes: Array<{
    relX: number;
    relY: number;
    radX: number;
    radY: number;
    angle: number;
  }>;
}

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  timeline: string;
  tech: string[];
  description: string;
  features: string[];
  impact: string;
  links?: {
    demo?: string;
    github?: string;
  };
}

export interface EducationData {
  institution: string;
  location: string;
  degree: string;
  grade: string;
  period: string;
}

export interface ExperienceData {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  skills: string[];
}

export interface CertificationData {
  title: string;
  issuer: string;
  year: string;
  category: 'Cloud & AI' | 'Web Development' | 'Programming & DB';
}
