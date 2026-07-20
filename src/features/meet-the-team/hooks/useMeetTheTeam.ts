import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
} from "../api/MeetTheTeam.api";

export const useTeamMembers = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["team-members", params],
    queryFn: () => getAllTeamMembers(params),
  });
};

export const useTeamMember = (id?: string) => {
  return useQuery({
    queryKey: ["team-member", id],
    queryFn: () => getTeamMemberById(id as string),
    enabled: !!id,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeamMember,
    onSuccess: (res) => {
      toast.success(res?.message || "Team member added");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add team member";
      toast.error(message);
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTeamMember,
    onSuccess: (res) => {
      toast.success(res?.message || "Team member updated");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update team member";
      toast.error(message);
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: (res) => {
      toast.success(res?.message || "Team member deleted");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete team member";
      toast.error(message);
    },
  });
};
