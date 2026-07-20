// src/features/reviews/types/reviews.types.ts

export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  comment: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Review[];
  meta: Meta;
}
