import axiosInstance from "@/lib/instance/axios-instance";

export const getAllJobs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axiosInstance.get("/jobs/all", { params });
  return response.data;
};

export const getSingleJob = async (jobId: string) => {
  const response = await axiosInstance.get(`/jobs/single/${jobId}`);
  return response.data;
};

export const createJob = async (data: FormData) => {
  const response = await axiosInstance.post("/jobs/create-job", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateJob = async ({
  jobId,
  data,
}: {
  jobId: string;
  data: FormData;
}) => {
  const response = await axiosInstance.put(`/jobs/update-job/${jobId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateJobStatus = async ({
  jobId,
  status,
}: {
  jobId: string;
  status: "open" | "closed" | "filled";
}) => {
  const response = await axiosInstance.put(`/jobs/${jobId}`, { status });
  return response.data;
};

export const deleteJob = async (jobId: string) => {
  const response = await axiosInstance.put(`/jobs/delete/${jobId}`);
  return response.data;
};
