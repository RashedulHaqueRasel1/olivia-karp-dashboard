import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllJobs,
  updateJob,
  deleteJob,
  getAppliedJobs,
  updateApplyJobStatus,
  updateJobStatus,
} from "../api/opportunity.api";

export const useOpportunityJobs = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["opportunity-jobs", params],
    queryFn: () => getAllJobs(params),
  });
};

export const useUpdateOpportunityJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-jobs"] });
    },
  });
};

export const useDeleteOpportunityJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
    },
  });
};

export const useAppliedJobs = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["applied-jobs", params],
    queryFn: () => getAppliedJobs(params),
  });
};

export const useUpdateApplyJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplyJobStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-jobs"] });
    },
  });
};
