import api from './axiosInstance';
import type { Resume, ResumeVersion, SaveResumeData, ResumeData, EditorResumeContent } from '@/types/resume';

export const resumeApi = {
  create: async (data: SaveResumeData): Promise<{ success: boolean; message: string; data: Resume }> => {
    const response = await api.post<{ success: boolean; message: string; data: Resume }>('/resumes', data);
    return response.data;
  },

  getAll: async (): Promise<{ success: boolean; data: Resume[] }> => {
    const response = await api.get<{ success: boolean; data: Resume[] }>('/resumes');
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Resume }> => {
    const response = await api.get<{ success: boolean; data: Resume }>(`/resumes/${id}`);
    return response.data;
  },

  update: async (id: string, data: SaveResumeData): Promise<{ success: boolean; message: string; data: Resume }> => {
    const response = await api.patch<{ success: boolean; message: string; data: Resume }>(`/resumes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/resumes/${id}`);
    return response.data;
  },

  createVersion: async (resumeId: string, data: { company: string; role: string; content: EditorResumeContent }): Promise<{ success: boolean; message: string; data: ResumeVersion }> => {
    const response = await api.post<{ success: boolean; message: string; data: ResumeVersion }>(`/resumes/${resumeId}/versions`, data);
    return response.data;
  },

  getVersions: async (resumeId: string): Promise<{ success: boolean; data: ResumeVersion[] }> => {
    const response = await api.get<{ success: boolean; data: ResumeVersion[] }>(`/resumes/${resumeId}/versions`);
    return response.data;
  }
};
