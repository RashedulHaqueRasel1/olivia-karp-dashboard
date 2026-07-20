// src/features/auth/api/refresh-token.api.ts

import axiosInstance from "@/lib/instance/axios-instance";

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post("/auth/refresh-access-token", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};
