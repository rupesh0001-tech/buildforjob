import api from "./axiosInstance";
import type { CoverLetter, SaveCoverLetterData } from "@/types/cover-letter";

export const createCoverLetter = async (data: SaveCoverLetterData): Promise<CoverLetter> => {
  const response = await api.post<CoverLetter>("/cover-letters", data);
  return response.data;
};

export const getAllCoverLetters = async (): Promise<CoverLetter[]> => {
  const response = await api.get<CoverLetter[]>("/cover-letters");
  return response.data;
};

export const getCoverLetterById = async (id: string): Promise<CoverLetter> => {
  const response = await api.get<CoverLetter>(`/cover-letters/${id}`);
  return response.data;
};

export const updateCoverLetter = async (id: string, data: Partial<SaveCoverLetterData>): Promise<CoverLetter> => {
  const response = await api.put<CoverLetter>(`/cover-letters/${id}`, data);
  return response.data;
};

export const deleteCoverLetter = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/cover-letters/${id}`);
  return response.data;
};

export const compileCoverLetterPreviewPdf = async (content: any, templateId?: string): Promise<Blob> => {
  const response = await api.post(
    "/cover-letters/compile-preview",
    { content, templateId },
    { responseType: "blob" }
  );
  return response.data;
};

export const getCoverLetterLatexSource = async (content: any, templateId?: string): Promise<string> => {
  const response = await api.post<{ success: boolean; data: { latexSource: string; templateId: string } }>(
    "/cover-letters/latex-source",
    { content, templateId }
  );
  return response.data?.data?.latexSource || "";
};

export const getCoverLetterTemplates = async (): Promise<{ id: string; name: string; description: string }[]> => {
  const response = await api.get<{ success: boolean; data: { id: string; name: string; description: string }[] }>(
    "/cover-letters/templates"
  );
  return response.data?.data || [];
};

export const coverLetterApi = {
  create: createCoverLetter,
  getAll: getAllCoverLetters,
  getById: getCoverLetterById,
  update: updateCoverLetter,
  delete: deleteCoverLetter,
  compilePreviewPdf: compileCoverLetterPreviewPdf,
  getLatexSource: getCoverLetterLatexSource,
  getTemplates: getCoverLetterTemplates,
};

