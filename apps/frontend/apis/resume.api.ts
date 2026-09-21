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
  },

  compilePreviewPdf: async (content: any, templateId?: string): Promise<Blob> => {
    const response = await api.post('/resumes/compile-preview', { content, templateId }, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportPdf: async (id: string, templateId?: string, download: boolean = false): Promise<any> => {
    if (download) {
      const response = await api.post(`/resumes/${id}/export`, { templateId, download: true }, {
        responseType: 'blob',
      });
      return response.data;
    }
    const response = await api.post(`/resumes/${id}/export`, { templateId, download: false });
    return response.data;
  },

  getLatexSource: async (content: any, templateId?: string): Promise<string> => {
    const response = await api.post<{ success: boolean; data: { latexSource: string } }>('/resumes/latex-source', {
      content,
      templateId,
    });
    return response.data?.data?.latexSource || '';
  },

  getTemplates: async (): Promise<{ success: boolean; data: { id: string; name: string; description: string }[] }> => {
    const response = await api.get('/resumes/templates');
    return response.data;
  },

  getLatestExport: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/resumes/${id}/pdf`);
    return response.data;
  }
};
