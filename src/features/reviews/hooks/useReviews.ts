// src/features/reviews/hooks/useReviews.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteReview,
  getAllReviews,
  toggleReviewApproval,
} from "../api/reviews.api";

export const useReviews = (params?: {
  page?: number;
  limit?: number;
  isApproved?: boolean;
}) => {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => getAllReviews(params),
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useToggleReviewApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleReviewApproval,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
