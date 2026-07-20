import axiosInstance from "@/lib/instance/axios-instance";
import { TeamListResponse, TeamMember } from "../types/meetTheTeam.types";

export const getAllTeamMembers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<TeamListResponse> => {
  const response = await axiosInstance.get("/team/all", { params });
  return response.data;
};

export const getTeamMemberById = async (
  id: string,
): Promise<{ data: TeamMember }> => {
  const response = await axiosInstance.get(`/team/${id}`);
  return response.data;
};

export const createTeamMember = async (data: FormData) => {
  const response = await axiosInstance.post("/team/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateTeamMember = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  const response = await axiosInstance.put(`/team/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteTeamMember = async (id: string) => {
  const response = await axiosInstance.delete(`/team/${id}`);
  return response.data;
};
