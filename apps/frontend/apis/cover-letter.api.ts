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
