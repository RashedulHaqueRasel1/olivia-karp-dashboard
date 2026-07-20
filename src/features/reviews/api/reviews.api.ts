// src/features/reviews/api/reviews.api.ts

import axiosInstance from "@/lib/instance/axios-instance";
import { ReviewsResponse } from "../types/reviews.types";

export const getAllReviews = async (params?: {
  page?: number;
  limit?: number;
  isApproved?: boolean;
}) => {
  const response = await axiosInstance.get<ReviewsResponse>("/review/all", {
    params,
  });
  return response.data;
};

export const deleteReview = async (id: string) => {
  const response = await axiosInstance.delete(`/review/${id}`);
  return response.data;
};

export const toggleReviewApproval = async ({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) => {
  const response = await axiosInstance.patch(`/review/${reviewId}`, {
    isApproved,
  });
  return response.data;
};
