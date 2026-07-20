import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSurveys,
  getSingleSurvey,
  deleteSurvey,
} from "../api/survey.api";

export const useSurveys = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
}) => {
  return useQuery({
    queryKey: ["surveys", params],
    queryFn: () => getAllSurveys(params),
  });
};

export const useSingleSurvey = (id: string) => {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSingleSurvey(id),
    enabled: !!id,
  });
};

export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
};
