import axiosInstance from "@/lib/instance/axios-instance";

export const getAllEvents = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get("/event/get", { params });
  return response.data;
};

export const createEvent = async (data: { lumaUrl: string }) => {
  const response = await axiosInstance.post("/event/create", data);
  return response.data;
};

export const togglePublishEvent = async ({
  eventId,
  isPublished,
}: {
  eventId: string;
  isPublished: boolean;
}) => {
  const response = await axiosInstance.patch(
    `/event/${eventId}/toggle-publish`,
    { isPublished },
  );
  return response.data;
};

export const deleteEvent = async (eventId: string) => {
  const response = await axiosInstance.delete(`/event/${eventId}`);
  return response.data;
};
