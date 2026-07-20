import axiosInstance from "@/lib/instance/axios-instance";

export const getAllMedia = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get("/media/get-media", { params });
  return response.data;
};

export const getSingleMedia = async (mediaId: string) => {
  const response = await axiosInstance.get(
    `/media/get-single-media/${mediaId}`,
  );
  return response.data;
};

export const createMedia = async (data: FormData) => {
  const response = await axiosInstance.post("/media/create-media", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateMedia = async ({
  mediaId,
  data,
}: {
  mediaId: string;
  data: FormData;
}) => {
  const response = await axiosInstance.patch(
    `/media/update-media/${mediaId}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await axiosInstance.delete(`/media/delete-media/${mediaId}`);
  return response.data;
};
