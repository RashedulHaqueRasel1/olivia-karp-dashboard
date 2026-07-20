"use client";

import { useCallback, useState } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useJobs, useDeleteJob, useUpdateJobStatus } from "../hooks/useJobs";
import { Job, Meta } from "../types/content.types";
import JobPostModal from "./JobPostModal";
import JobDetailsModal from "./JobDetailsModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import TableSkeleton from "./TableSkeleton";
import { toast } from "sonner";

export default function JobPostPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  const { data: response, isLoading, isError } = useJobs({ page, limit });
  const deleteMutation = useDeleteJob();
  const statusMutation = useUpdateJobStatus();

  const jobs: Job[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingJob(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingJobId) return;
    try {
      await deleteMutation.mutateAsync(deletingJobId);
      toast.success("Job deleted successfully");
      setDeletingJobId(null);
    } catch {
      toast.error("Failed to delete job");
    }
  }, [deletingJobId, deleteMutation]);

  if (isError) {
    return (
      <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
        <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
          <div className="flex items-center justify-center py-20">
            <p className="text-[#d9534f]">
              Failed to load jobs data. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#2c3135] md:text-[22px]">
              Job Posts
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span>Content Management</span>
              <span>&gt;</span>
              <span>Job Posts</span>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#003d40] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Job Post
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton columns={6} />
          ) : (
            <div className="overflow-hidden rounded-[8px] border border-[#d8dfdf] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#d8dfdf] bg-white">
                      <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                        Title
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Category
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Company
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Job Type
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, index) => (
                      <tr
                        key={job._id}
                        className={`border-b border-[#d8dfdf] transition hover:bg-[#f8fbfb] ${index === jobs.length - 1 ? "border-b-0" : ""}`}
                      >
                        <td className="px-4 py-4">
                          <div className="max-w-[250px] truncate font-medium text-[#2c3135] text-[15px]">
                            {job.title}
                          </div>
                          <span className="text-[12px] text-[#7a99b8] block mt-0.5">
                            {job.location}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex rounded-full px-3 py-1 text-[12px] font-medium bg-[#e8f4f5] text-[#004f52]">
                            {job.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-[14px] font-medium text-[#252b2f]">
                          {job.companyName}
                        </td>
                        <td className="px-4 py-4 text-center text-[14px] text-[#5f686d] capitalize">
                          {job.jobType}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <select
                            value={job.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as
                                | "open"
                                | "closed"
                                | "filled";
                              try {
                                await statusMutation.mutateAsync({
                                  jobId: job._id,
                                  status: newStatus,
                                });
                                toast.success(
                                  `Job status updated to ${newStatus}`,
                                );
                              } catch {
                                toast.error("Failed to update job status");
                              }
                            }}
                            className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium border-none outline-none ${
                              job.status === "open"
                                ? "bg-[#cdeed9] text-[#0d6b42]"
                                : job.status === "filled"
                                  ? "bg-[#e8f1fa] text-[#367588]"
                                  : "bg-[#fde2e2] text-[#d9534f]"
                            }`}
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="filled">Filled</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-5 text-[#004f52]">
                            <button
                              onClick={() => setViewingJob(job)}
                              className="transition hover:opacity-70 p-1 cursor-pointer"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingJob(job);
                                setIsModalOpen(true);
                              }}
                              className="transition hover:opacity-70 p-1 cursor-pointer"
                            >
                              <Pencil className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => setDeletingJobId(job._id)}
                              className="transition hover:opacity-70 p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {jobs.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-[#7a99b8]"
                        >
                          No job posts found. Create one to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {jobs.length > 0 && (
                <div className="flex flex-col gap-4 bg-[#eef3f4] px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                  <p className="text-[14px] text-[#5f686d]">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, meta.total)} of {meta.total} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] bg-[#004f52] px-3 font-medium text-white shadow-sm">
                      {page}
                    </button>
                    {meta.totalPage > 1 && page < meta.totalPage && (
                      <>
                        <span className="text-[#5b6e70] text-sm">...</span>
                        <button
                          onClick={() => setPage(meta.totalPage)}
                          className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] px-3 text-[#5b6e70] transition hover:bg-white"
                        >
                          {meta.totalPage}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPage || 1, p + 1))
                      }
                      disabled={page >= (meta.totalPage || 1)}
                      className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <JobPostModal
        open={isModalOpen}
        onClose={handleCloseModal}
        editData={editingJob}
      />

      <DeleteConfirmDialog
        open={!!deletingJobId}
        onClose={() => setDeletingJobId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Post"
        description="Are you sure you want to delete this job post? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />

      {viewingJob && (
        <JobDetailsModal job={viewingJob} onClose={() => setViewingJob(null)} />
      )}
    </section>
  );
}
