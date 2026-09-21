import axiosInstance from "./axiosInstance";

let cachedCompanies: { data: any; timestamp: number; userOnly: boolean } | null = null;
let inFlightCompaniesPromise: Promise<any> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const getCompanies = async (userOnly = false) => {
  const now = Date.now();
  if (cachedCompanies && cachedCompanies.userOnly === userOnly && (now - cachedCompanies.timestamp < CACHE_TTL_MS)) {
    return cachedCompanies.data;
  }

  if (inFlightCompaniesPromise) {
    return inFlightCompaniesPromise;
  }

  inFlightCompaniesPromise = axiosInstance.get(`/companies${userOnly ? "?userOnly=true" : ""}`)
    .then((response) => {
      cachedCompanies = {
        data: response.data,
        timestamp: Date.now(),
        userOnly,
      };
      return response.data;
    })
    .finally(() => {
      inFlightCompaniesPromise = null;
    });

  return inFlightCompaniesPromise;
};

export const createCompany = async (name: string) => {
  cachedCompanies = null; // Invalidate cache
  const response = await axiosInstance.post("/companies", { name });
  return response.data;
};
