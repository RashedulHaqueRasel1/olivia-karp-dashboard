import { useQuery } from "@tanstack/react-query";
import {
  getDashbaordChartOverview,
  getDashboardOverview,
  getDashboardRecentActivity,
} from "../api/dashboardOverviewapi";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
  });
};

export const useDashboardChartOverview = (type: string, year: string) => {
  return useQuery({
    queryKey: ["dashboard-chart-overview", type, year],
    queryFn: () => getDashbaordChartOverview(type, year),
  });
};

export const useDashboardRecentActivity = () => {
  return useQuery({
    queryKey: ["dashboard-recent-activity"],
    queryFn: getDashboardRecentActivity,
  });
};
