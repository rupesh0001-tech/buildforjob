import axiosInstance from "./axiosInstance";

export const createVersion = async (formData: FormData) => {
  const response = await axiosInstance.post("/versions", formData);
  return response.data;
};

export const getVersions = async () => {
  const response = await axiosInstance.get("/versions");
  return response.data;
};

export const deleteVersion = async (id: string) => {
  const response = await axiosInstance.delete(`/versions/${id}`);
  return response.data;
};
