import api from './axiosInstance';

export interface ATSResult {
  id?: string;
  score: number;
  details: string;
  resumeWordCount: number;
  jdWordCount: number;
  jobDescription: string;
  resumeUrl?: string;
  resumeName?: string;
  createdAt?: string;
  suggestions?: ATSSuggestions | null;
}

/**
 * Uploads a PDF resume and job description to get an ATS score.
 */
export const checkATSScore = async (
  resumeFile: File,
  jobDescription: string
): Promise<ATSResult> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('/ats/check', formData);

  return response.data.data as ATSResult;
};

/**
 * Extracts raw text from a PDF resume (for preview/debug).
 */
export const extractPDFText = async (
  resumeFile: File
): Promise<{ text: string; wordCount: number; charCount: number }> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);

  const response = await api.post('/ats/extract', formData);

  return response.data.data;
};

export interface ATSSuggestions {
  improvements: Array<{ title: string; description: string; impact: number }>;
  missingKeywords: string[];
  missingSkills: string[];
}

/**
 * Gets AI-powered improvement suggestions in structured format.
 */
export const getATSSuggestions = async (
  resumeFile: File,
  jobDescription: string,
  reportId?: string
): Promise<ATSSuggestions> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);
  if (reportId) {
    formData.append('reportId', reportId);
  }

  const response = await api.post('/ats/suggestions', formData);

  return response.data.data;
};

/**
 * Gets list of all saved ATS reports (history).
 */
export const getATSReports = async (): Promise<ATSResult[]> => {
  const response = await api.get('/ats/reports');
  return response.data.data;
};

/**
 * Gets details for a single saved ATS report.
 */
export const getATSReportById = async (id: string): Promise<ATSResult> => {
  const response = await api.get(`/ats/reports/${id}`);
  return response.data.data;
};

/**
 * Unlocks and generates suggestions for a saved ATS report.
 */
export const unlockReportSuggestions = async (id: string): Promise<ATSSuggestions> => {
  const response = await api.post(`/ats/reports/${id}/unlock`);
  return response.data.data;
};
