import axiosInstance from "@/lib/instance/axios-instance";

export const getAllNotifications = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axiosInstance.get("/notifications", { params });
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.get("/notifications/mark-all-read");
  return response.data;
};
