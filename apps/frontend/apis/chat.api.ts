import api from './axiosInstance';

export interface ChatMessageItem {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  scrapedJob?: {
    company: string;
    role: string;
    location?: string;
    jobDescription: string;
    requirements?: string[];
    responsibilities?: string[];
    sourceUrl?: string;
    found: boolean;
  } | null;
}

export interface ChatResponse {
  reply: string;
  scrapedJob?: {
    company: string;
    role: string;
    location?: string;
    jobDescription: string;
    requirements?: string[];
    responsibilities?: string[];
    sourceUrl?: string;
    found: boolean;
  } | null;
}

/**
 * Send chat message to AI Assistant
 */
export const sendChatMessage = async (
  message: string,
  history: { role: 'user' | 'assistant' | 'system'; content: string }[] = []
): Promise<ChatResponse> => {
  const response = await api.post('/ai/chat', { message, history });
  return response.data.data;
};

/**
 * Direct career scraping tool API
 */
export const scrapeCareer = async (
  company: string,
  role: string,
  location?: string
) => {
  const response = await api.post('/ai/scrape-career', { company, role, location });
  return response.data.data;
};
