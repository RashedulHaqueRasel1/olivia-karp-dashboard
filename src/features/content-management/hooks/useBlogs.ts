import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../api/blog.api";

export const useBlogs = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: () => getAllBlogs(params),
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
