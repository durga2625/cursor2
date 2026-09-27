import { ProjectData, EducationData, ExperienceData, CertificationData } from '../types';

export const PERSONAL_INFO = {
  name: "Sri Ramya",
  tagline: "Full Stack Engineer & AI/ML Specialist",
  location: "Kakinada, Andhra Pradesh, India",
  email: "sriramyaburadakavi@gmail.com",
  phone: "+91 6302368063",
  leetcode: "https://leetcode.com/u/Sriramya_Buradakavi",
  linkedin: "https://linkedin.com/in/sriramya-buradakavi",
  hackerrank: "https://hackerrank.com/sriramyaburadak1",
  github: "https://github.com/sriramyaburadakavi",
  summary: "Results-driven computer science engineer specializing in Artificial Intelligence and Machine Learning. Experienced in building responsive full-stack applications, scalable APIs, and intelligent data systems. Proven record of competitive problem-solving with 100+ LeetCode solutions, 5-star HackerRank accolades, and AWS certification."
};

export const EDUCATION_LIST: EducationData[] = [
  {
    institution: "Aditya Engineering College",
    location: "Surampalem, Andhra Pradesh",
    degree: "B.Tech in Artificial Intelligence & Machine Learning",
    grade: "8.81 CGPA",
    period: "Sep 2023 — May 2027"
  },
  {
    institution: "Aditya Junior College",
    location: "Kakinada, Andhra Pradesh",
    degree: "Intermediate in MPC (Mathematics, Physics, Chemistry)",
    grade: "92.1%",
    period: "Jul 2021 — Apr 2023"
  },
  {
    institution: "Aditya School",
    location: "Kakinada, Andhra Pradesh",
    degree: "Secondary School Certificate (SSC)",
    grade: "100%",
    period: "Jun 2020 — Apr 2021"
  }
];

export const EXPERIENCE_LIST: ExperienceData[] = [
  {
    role: "Full Stack Development Intern",
    company: "Technical Hub Pvt Ltd",
    location: "Kakinada, India",
    period: "May 2025 — Jun 2025",
    highlights: [
      "Completed rigorous hands-on engineering in Full Stack Development, architecting and deploying 5+ responsive production-grade web applications utilizing modern HTML5, CSS3, and JavaScript.",
      "Solved 40+ complex coding challenges, enhancing logical reasoning, algorithmic thinking, and structural problem-solving throughput.",
      "Collaborated in a cross-functional squad contributing to end-to-end UI design systems and secure backend RESTful API integration.",
      "Applied industry-standard Agile methodologies, feature branch Git workflows, peer code reviews, and modern CI/CD deployment practices."
    ],
    skills: ["HTML5", "CSS3", "JavaScript", "REST APIs", "Git", "Agile Workflows", "Responsive Design"]
  }
];

export const PROJECTS_LIST: ProjectData[] = [
  {
    id: "trip-nest",
    title: "Trip Nest",
    subtitle: "AI-Powered Smart Travel Planning & Multimodal Companion",
    timeline: "2025",
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "MySQL", "Web APIs"],
    description: "An intuitive, all-in-one travel architecture designed to eliminate vacation planning friction with intelligent recommendation systems, drag-and-drop itinerary builders, and real-time localization utilities.",
    features: [
      "Interactive Drag-and-Drop Itinerary Builder for seamless day-wise schedule reordering and activity scheduling.",
      "Geo-spatial Tourist Recommendation Engine matching optimal points of interest between any two destination coordinates.",
      "Live Exchange Rate Currency Converter utilizing real-time financial API endpoints.",
      "Multimodal Language Translation Hub integrating Speech-to-Text, contextual text translation, and neural Text-to-Speech synthesis."
    ],
    impact: "Cut average itinerary creation time by 65% while providing multilingual travelers with instant translation and financial conversion tools."
  },
  {
    id: "clarify-me",
    title: "Clarify Me",
    subtitle: "Real-Time Academic Doubt Resolution & Faculty Portal",
    timeline: "2024 — 2025",
    tech: ["HTML5", "CSS3", "JavaScript", "MySQL", "PHP / Node Services"],
    description: "A centralized academic communication ecosystem bridging students and faculty for frictionless inquiry logging, categorized thread resolution, and collaborative peer learning.",
    features: [
      "Real-time academic inquiry feed with category tags, urgency levels, and attachment support.",
      "Faculty response dashboard featuring verified answer badges, threaded discussions, and notification pings.",
      "Persistent MySQL relational schema maintaining audit logs, student profiles, and historical knowledge archives.",
      "Structured search index allowing students to discover previously resolved doubts to eliminate redundant questions."
    ],
    impact: "Adopted by 300+ students across departments with 94% faster inquiry turnaround times between classes."
  }
];

export const TECH_SKILLS = {
  languages: [
    { name: "Python", proficiency: "Advanced", icon: "terminal" },
    { name: "JavaScript", proficiency: "Advanced", icon: "code" },
    { name: "Java", proficiency: "Proficient", icon: "coffee" },
    { name: "C", proficiency: "Proficient", icon: "cpu" },
    { name: "HTML5 & CSS3", proficiency: "Expert", icon: "layout" }
  ],
  databases: [
    { name: "MySQL", proficiency: "Advanced", icon: "database" },
    { name: "Relational Modeling", proficiency: "Proficient", icon: "table" }
  ],
  cloudAndDevOps: [
    { name: "AWS S3", proficiency: "Proficient", icon: "cloud" },
    { name: "AWS VPC", proficiency: "Proficient", icon: "network" },
    { name: "AWS IAM", proficiency: "Proficient", icon: "shield" },
    { name: "AWS Certificate Manager", proficiency: "Proficient", icon: "key" },
    { name: "AWS CloudFront", proficiency: "Proficient", icon: "globe" }
  ],
  toolsAndIDEs: [
    { name: "Git & GitHub", proficiency: "Advanced", icon: "git-branch" },
    { name: "VS Code", proficiency: "Expert", icon: "monitor" },
    { name: "Jupyter Notebook", proficiency: "Advanced", icon: "book-open" }
  ]
};

export const CERTIFICATIONS_LIST: CertificationData[] = [
  {
    title: "AWS Certified AI Practitioner",
    issuer: "AWS Academy",
    year: "2025",
    category: "Cloud & AI"
  },
  {
    title: "Java Foundations Certified Associate",
    issuer: "Oracle Academy",
    year: "2025",
    category: "Programming & DB"
  },
  {
    title: "IT Specialist: HTML & CSS Certification",
    issuer: "Certiport",
    year: "2024",
    category: "Web Development"
  },
  {
    title: "SQL (Basic & Intermediate) Certifications",
    issuer: "HackerRank",
    year: "2024",
    category: "Programming & DB"
  },
  {
    title: "HTML, CSS & JavaScript Certifications",
    issuer: "Cisco Networking Academy",
    year: "2024",
    category: "Web Development"
  }
];

export const ACHIEVEMENTS = [
  {
    metric: "5-Star Golden Badges",
    label: "HackerRank",
    detail: "Awarded top 5-star golden proficiency in C and MySQL, alongside 3-star badges in Java and Python."
  },
  {
    metric: "100+ Solved",
    label: "LeetCode",
    detail: "Solved 100+ algorithmic and data structure problems with consistent performance across arrays, DP, and trees."
  },
  {
    metric: "1-Star Coder",
    label: "CodeChef",
    detail: "Active competitive programming participant recognized with official 1-star platform rating."
  },
  {
    metric: "8.81 CGPA",
    label: "B.Tech AI & ML",
    detail: "Consistent high academic standing at Aditya Engineering College across machine learning and CS foundational tracks."
  }
];
