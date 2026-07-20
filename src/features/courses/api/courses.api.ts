// src/features/courses/api/courses.api.ts

import axiosInstance from "@/lib/instance/axios-instance";

// get all courses

export const getAllCourses = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  isApproved?: boolean;
}) => {
  const response = await axiosInstance.get("/course/all", { params });
  return response.data;
};

// create a course
export const createCourse = async (data: FormData) => {
  const response = await axiosInstance.post("/course/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const toggleCourse = async (id: string) => {
  const response = await axiosInstance.put(`/course/availability/${id}`);
  return response.data;
};

export const updateCourse = async (id: string, data: FormData) => {
  const response = await axiosInstance.put(`/course/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await axiosInstance.delete(`/course/${id}`);
  return response.data;
};
