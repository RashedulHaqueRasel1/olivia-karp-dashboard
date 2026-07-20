// src/features/mentorsCoaches/hooks/useMentorsCoaches.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMentorsAndCoaches,
  approveMentorCoach,
  joinMentorCoach,
  bulkUploadMentorsCoaches,
} from "../api/mentorsCoaches.api";

export const useMentorsCoaches = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  isApproved?: boolean;
}) => {
  return useQuery({
    queryKey: ["mentors-coaches", params],
    queryFn: () => getAllMentorsAndCoaches(params),
  });
};

export const useApproveMentorCoach = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveMentorCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors-coaches"] });
    },
  });
};

export const useJoinMentorCoach = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinMentorCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors-coaches"] });
    },
  });
};

export const useBulkUploadMentorsCoaches = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUploadMentorsCoaches,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors-coaches"] });
    },
  });
};
