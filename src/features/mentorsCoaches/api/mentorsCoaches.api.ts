// src/features/mentorsCoaches/api/mentorsCoaches.api.ts

import axiosInstance from "@/lib/instance/axios-instance";

// get all mentors and coaches

export const getAllMentorsAndCoaches = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  isApproved?: boolean;
}) => {
  const response = await axiosInstance.get("/mentors-coaches", { params });
  return response.data;
};

// approve mentor or coach
export const approveMentorCoach = async (id: string) => {
  const response = await axiosInstance.put(`/mentors-coaches/approved/${id}`);
  return response.data;
};

// join as a mentor or coach
export const joinMentorCoach = async (data: FormData) => {
  const response = await axiosInstance.post(`/mentors-coaches/join`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// bulk upload mentors or coaches
export const bulkUploadMentorsCoaches = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    "/mentors-coaches/bulk-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
