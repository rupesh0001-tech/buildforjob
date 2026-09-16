import axiosInstance from "./axiosInstance";

export const getCompanies = async (userOnly = false) => {
  const response = await axiosInstance.get(`/companies${userOnly ? "?userOnly=true" : ""}`);
  return response.data;
};

export const createCompany = async (name: string) => {
  const response = await axiosInstance.post("/companies", { name });
  return response.data;
};
