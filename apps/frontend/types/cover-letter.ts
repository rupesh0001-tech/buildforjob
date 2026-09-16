export interface CoverLetterPersonalInfo {
  fullName?: string;
  address?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

export interface CoverLetterEmployerInfo {
  managerName?: string;
  teamName?: string;
  companyName?: string;
  recipientName?: string;
  jobTitle?: string;
  address?: string;
}

export interface CoverLetterBodyContent {
  intro?: string;
  body1?: string;
  body2?: string;
  body3?: string;
  conclusion?: string;
}

export interface CoverLetterContent {
  personalInfo?: CoverLetterPersonalInfo;
  employerInfo?: CoverLetterEmployerInfo;
  date?: string;
  salutation?: string;
  mode?: "structured" | "manual";
  body?: CoverLetterBodyContent;
  manualContent?: string;
  signOff?: string;
}

export interface CoverLetter {
  id: string;
  title: string;
  company?: string | null;
  recipient?: string | null;
  template: string;
  content: CoverLetterContent | null;
  isDraft: boolean;
  isMagic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCoverLetterData {
  title: string;
  company?: string;
  recipient?: string;
  template: string;
  content: CoverLetterContent;
  isDraft?: boolean;
  isMagic?: boolean;
}
