export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  website?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  jobTitle?: string;
  isVerified?: boolean;
  profileSynced?: boolean;
  tokens?: number;
  lastTokenReset?: string;
  plan?: 'FREE' | 'PRO';
  createdAt?: string;

  // Profile Builder Fields
  skills?: { id?: string; name: string; isGithubSynced?: boolean }[];
  experience?: {
    id?: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    isCurrent: boolean;
  }[];
  education?: {
    id?: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string | null;
    graduationType?: string | null;
  }[];
  projects?: {
    id?: string;
    name: string;
    techStack?: string | null;
    description?: string | null;
    isGithubSynced?: boolean;
  }[];
  socialLinks?: SocialLinks | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse extends ApiResponse {
  data?: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse extends ApiResponse {
  data?: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
  type: 'REGISTRATION' | 'PASSWORD_RESET';
}
