// src/features/dashboard-overview/api/dashboardOverviewapi.ts

import axiosInstance from "@/lib/instance/axios-instance";

export const getDashboardOverview = async () => {
  const response = await axiosInstance.get("/analytics/dashboard");
  return response.data;
};

export const getDashbaordChartOverview = async (
  type: string = "monthly",
  year: string = "2026",
) => {
  const response = await axiosInstance.get(
    `/analytics/chat?type=${type}&year=${year}`,
  );
  return response.data;
};

export const getDashboardRecentActivity = async () => {
  const response = await axiosInstance.get("/analytics/activity");
  return response.data;
};
