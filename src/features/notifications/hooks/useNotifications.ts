import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllNotifications,
  markAllNotificationsRead,
} from "../api/notification.api";

export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getAllNotifications(params),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
