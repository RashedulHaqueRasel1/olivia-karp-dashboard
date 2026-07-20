import axiosInstance from "@/lib/instance/axios-instance";

export const getAllBlogs = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get("/blog/get-blogs", { params });
  return response.data;
};

export const getSingleBlog = async (blogId: string) => {
  const response = await axiosInstance.get(`/blog/get-single-blog/${blogId}`);
  return response.data;
};

export const createBlog = async (data: FormData) => {
  const response = await axiosInstance.post("/blog/create-blog", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlog = async ({
  blogId,
  data,
}: {
  blogId: string;
  data: FormData;
}) => {
  const response = await axiosInstance.patch(
    `/blog/update-blog/${blogId}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const deleteBlog = async (blogId: string) => {
  const response = await axiosInstance.delete(`/blog/delete-blog/${blogId}`);
  return response.data;
};
