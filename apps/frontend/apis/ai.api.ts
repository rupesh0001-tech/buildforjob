import api from './axiosInstance';

/**
 * Sends a text prompt to the backend AI generator (consumes 0.5 tokens).
 */
export const generateAI = async (prompt: string, type?: string): Promise<string> => {
  const response = await api.post('/ai/generate', { prompt, type });
  return response.data.data.text;
};

export const generateJobDescription = async (roles: string[], companyName?: string): Promise<string> => {
  const response = await api.post('/ai/generate-jd', { companyName: companyName || '', roles });
  return response.data.data.text;
};
