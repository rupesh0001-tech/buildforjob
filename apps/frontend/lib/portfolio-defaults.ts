export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolioUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  duration: string;
  gpa?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface CodingProfile {
  platform: 'GitHub' | 'LeetCode' | 'Codeforces' | 'CodeChef' | 'HackerRank';
  username: string;
  rating?: string;
  solved?: string;
  badge?: string;
  ranking?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  meta?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  description?: string;
  layout: 'text' | 'grid' | 'timeline';
  items: CustomSectionItem[];
}

export interface PortfolioData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    tagline: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl: string;
    resumeUrl?: string;
    isOpenToWork: boolean;
    socialLinks: SocialLinks;
  };
  aboutMe: {
    paragraphs: string[];
  };
  techStack: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  achievements: string[];
  codingProfiles: CodingProfile[];
  customSections: CustomSection[];
}

export interface PortfolioSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  fontFamily: string;
  isPublished?: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  defaultSettings: PortfolioSettings;
  defaultData: PortfolioData;
}

export const emptyDefaultData: PortfolioData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    resumeUrl: '',
    isOpenToWork: true,
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      portfolioUrl: ''
    }
  },
  aboutMe: {
    paragraphs: []
  },
  techStack: [],
  projects: [],
  experience: [],
  education: [],
  skills: [],
  achievements: [],
  codingProfiles: [],
  customSections: []
};

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'sleek-dark',
    name: 'Sleek Dark Developer',
    description: 'A premium, high-performance dark-themed portfolio featuring smooth glow cards, subtle typing headers, and sleek gradients.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coding-screen-screen-close-up-1736-large.mp4',
    defaultSettings: {
      theme: 'dark',
      accentColor: '#3B82F6',
      fontFamily: 'Inter',
      isPublished: false
    },
    defaultData: emptyDefaultData
  },
  {
    id: 'creative-green',
    name: 'Creative Cyber Green',
    description: 'A dark, cyber-inspired portfolio utilizing neon accents, geometric card structures, and a distinct futuristic layout.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-smartphone-with-green-matrix-background-41484-large.mp4',
    defaultSettings: {
      theme: 'dark',
      accentColor: '#22C55E',
      fontFamily: 'Space Grotesk',
      isPublished: false
    },
    defaultData: emptyDefaultData
  },
  {
    id: 'retro-terminal',
    name: 'Retro Terminal',
    description: 'A classic 80s CRT terminal theme complete with scanlines, blinking cursor command line, and monospace retro fonts.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-retro-monitors-in-control-room-41617-large.mp4',
    defaultSettings: {
      theme: 'dark',
      accentColor: '#22C55E',
      fontFamily: 'Fira Code',
      isPublished: false
    },
    defaultData: emptyDefaultData
  },
  {
    id: 'glass-creative',
    name: 'Glassmorphism Creative',
    description: 'A clean, modern layout focusing on high glassmorphism styles, vibrant pastel backgrounds, and colorful gradient accents.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fluid-colors-background-flow-41584-large.mp4',
    defaultSettings: {
      theme: 'light',
      accentColor: '#ec4899',
      fontFamily: 'Outfit',
      isPublished: false
    },
    defaultData: emptyDefaultData
  },
  {
    id: 'architect-prismatic',
    name: 'Architect Prismatic',
    description: 'A clean light design showcasing sharp grid geometry, clean lines, and responsive accent colors.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-house-exterior-32943-large.mp4',
    defaultSettings: {
      theme: 'light',
      accentColor: '#4648d4',
      fontFamily: 'Outfit',
      isPublished: false
    },
    defaultData: emptyDefaultData
  },
  {
    id: 'engineering-sleek',
    name: 'Engineering Sleek',
    description: 'A structured developer portfolio showcasing professional grid templates, dark mode options, and career metrics.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34283-large.mp4',
    defaultSettings: {
      theme: 'light',
      accentColor: '#3525cd',
      fontFamily: 'Space Grotesk',
      isPublished: false
    },
    defaultData: emptyDefaultData
  }
];
