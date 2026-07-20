import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../api/media.api";

export const useMedia = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => getAllMedia(params),
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};
