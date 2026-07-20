import axiosInstance from "@/lib/instance/axios-instance";

export const getAllSurveys = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
}) => {
  const response = await axiosInstance.get("/survey", { params });
  return response.data;
};

export const getSingleSurvey = async (id: string) => {
  const response = await axiosInstance.get(`/survey/${id}`);
  return response.data;
};

export const deleteSurvey = async (id: string) => {
  const response = await axiosInstance.delete(`/survey/${id}`);
  return response.data;
};
