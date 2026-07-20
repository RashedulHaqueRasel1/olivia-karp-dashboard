import axiosInstance from "@/lib/instance/axios-instance";

// ============ JOBS ============

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

export const deleteJob = async (jobId: string) => {
  const response = await axiosInstance.delete(`/jobs/delete-job/${jobId}`);
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

// ============ APPLY-JOB ============

export const getAppliedJobs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const response = await axiosInstance.get("/apply-job/all", { params });
  return response.data;
};

export const getSingleAppliedJob = async (id: string) => {
  const response = await axiosInstance.get(`/apply-job/${id}`);
  return response.data;
};

export const updateApplyJobStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "pending" | "shortlisted" | "rejected" | "accepted";
}) => {
  const response = await axiosInstance.put(`/apply-job/update/${id}`, {
    status,
  });
  return response.data;
};
