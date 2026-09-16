export interface ResumePersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  profession: string;
  image: string;
}

export interface ResumeExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  is_current: boolean;
  _id?: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  graduation_date: string;
  gpa: string;
  graduationType: "cgpa" | "percentage";
  _id?: string;
}

export interface ResumeProject {
  name: string;
  techStack: string;
  description: string;
  _id?: string;
}

export interface ResumeSectionVisibility {
  summary: boolean;
  experience: boolean;
  education: boolean;
  projects: boolean;
  skills: boolean;
}

// Structured data passed to templates (snake_case)
export interface ResumeData {
  personal_info: ResumePersonalInfo;
  professional_summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  project: ResumeProject[];
  skills: string[];
  sectionVisibility: ResumeSectionVisibility;
}

// Editor state saved to the server / store (camelCase)
export interface EditorResumeContent {
  personalInfoData: ResumePersonalInfo;
  professionalSummaryData: string;
  experienceData: ResumeExperience[];
  educationData: ResumeEducation[];
  projectData: ResumeProject[];
  skillData: string[];
  template: string;
  accentColor: string;
  sectionVisibility: ResumeSectionVisibility;
}

export interface Resume {
  id: string;
  title: string;
  template: string;
  content: EditorResumeContent;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    versions: number;
  };
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  company: string;
  role: string;
  content: EditorResumeContent;
  status: string;
  createdAt: string;
}

export interface SaveResumeData {
  title?: string;
  template?: string;
  content?: EditorResumeContent;
  isDraft?: boolean;
  isMagic?: boolean;
  company?: string;
}

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}
