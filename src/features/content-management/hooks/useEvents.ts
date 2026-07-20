import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEvents,
  createEvent,
  togglePublishEvent,
  deleteEvent,
} from "../api/event.api";

export const useEvents = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => getAllEvents(params),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useTogglePublishEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: togglePublishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
