"use client";

import { useCallback, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  useOpportunityJobs,
  useDeleteOpportunityJob,
  useAppliedJobs,
  useUpdateJobStatus,
} from "../hooks/useOpportunities";
import type { Job, Meta } from "../types/opportunity.types";
import DeleteConfirmDialog from "@/features/content-management/component/DeleteConfirmDialog";
import TableSkeleton from "@/features/content-management/component/TableSkeleton";
import EditJobModal from "./EditJobModal";
import { toast } from "sonner";

const FILTER_TABS = ["All Jobs", "Pending", "Running", "Applied"] as const;

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string | number;
  change: string;
}) {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]">
      <p className="text-base text-[#6c6c6c]">{label}</p>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-2xl font-semibold text-[#3b3b3b]">{value}</p>
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-medium text-[#3fa96b]">
            {change}
          </span>
          <TrendingUp className="h-3 w-3 text-[#3fa96b]" />
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "open":
      return { label: "Running", bg: "bg-[#e6f6f3]", text: "text-[#004242]" };
    case "closed":
      return { label: "Closed", bg: "bg-[#fef3c7]", text: "text-[#b45309]" };
    case "filled":
      return { label: "Filled", bg: "bg-[#e8f1fa]", text: "text-[#367588]" };
    case "pending":
      return { label: "Pending", bg: "bg-[#fef3c7]", text: "text-[#b45309]" };
    case "shortlisted":
      return {
        label: "Shortlisted",
        bg: "bg-[#e8f1fa]",
        text: "text-[#367588]",
      };
    case "accepted":
      return { label: "Accepted", bg: "bg-[#e6f6f3]", text: "text-[#004242]" };
    case "rejected":
      return { label: "Rejected", bg: "bg-[#fde2e2]", text: "text-[#d9534f]" };
    default:
      return { label: status, bg: "bg-[#e8f1fa]", text: "text-[#367588]" };
  }
}

export default function OpportunitiesManagement() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const isAppliedTab = activeTab === 3;

  const {
    data: jobsResponse,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useOpportunityJobs({ page, limit });

  //  console.log("job opportunities", jobsResponse)
  const {
    data: appliedResponse,
    isLoading: appliedLoading,
    isError: appliedError,
  } = useAppliedJobs(isAppliedTab ? { page, limit } : undefined);

  const deleteMutation = useDeleteOpportunityJob();
  const statusMutation = useUpdateJobStatus();

  const isLoading = isAppliedTab ? appliedLoading : jobsLoading;
  const isError = isAppliedTab ? appliedError : jobsError;

  // Build table data depending on active tab
  let jobs: Job[] = [];
  let meta: Meta = { page: 1, limit: 10, total: 0, totalPage: 0 };

  if (isAppliedTab) {
    const appliedData = appliedResponse?.data || [];
    jobs = appliedData.map(
      (item: {
        _id: string;
        jobId: { _id: string; title: string; category: string };
        userId: { firstName: string; lastName: string };
        status: string;
        appliedAt: string;
      }) => ({
        _id: item._id,
        title: item.jobId?.title || "N/A",
        companyName:
          `${item.userId?.firstName || ""} ${item.userId?.lastName || ""}`.trim(),
        location: "-",
        deathLine: item.appliedAt,
        status: item.status,
        category: item.jobId?.category || "",
      }),
    ) as Job[];
    meta = appliedResponse?.meta || meta;
  } else {
    const allJobs: Job[] = jobsResponse?.data || [];
    meta = jobsResponse?.meta || meta;

    if (activeTab === 1) {
      jobs = allJobs.filter((j) => j.status === "open");
    } else if (activeTab === 2) {
      jobs = allJobs.filter((j) => j.status === "closed");
    } else {
      jobs = allJobs;
    }
  }

  // Stat counts
  const allJobs: Job[] = jobsResponse?.data || [];
  const pendingCount = allJobs.filter((j) => j.status === "open").length;
  const runningCount = allJobs.filter((j) => j.status === "closed").length;
  const totalApply = appliedResponse?.meta?.total ?? 0;

  const getPageNumbers = () => {
    const totalPages = meta.totalPage || 0;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Job deleted successfully");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete job");
    }
  }, [deletingId, deleteMutation]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isError) {
    return (
      <section className="min-h-screen bg-[#f8fbfb] p-6">
        <div className="flex items-center justify-center py-20">
          <p className="text-[#d9534f]">
            Failed to load data. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8fbfb] p-6">
      <div className="flex flex-col gap-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            label="Pending Job Posts"
            value={pendingCount}
            change="+ 36%"
          />
          <StatCard
            label="Running Job Posts"
            value={runningCount}
            change="+ 36%"
          />
          <StatCard label="Total Apply" value={totalApply} change="+ 36%" />
        </div>

        {/* Main Table Card */}
        <div className="rounded-lg border border-[#cecece] bg-white p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#181919]">
                Opportunities Management
              </h1>
              <div className="mt-3 flex items-center gap-2 text-base text-[#6c6c6c]">
                <span>Dashboard</span>
                <ChevronRight className="h-4 w-4" />
                <span>Opportunities Management</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {FILTER_TABS.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(index)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-base transition ${
                    activeTab === index
                      ? "bg-[#004242] font-semibold text-white"
                      : "bg-[#eef4f5] font-normal text-[#004242]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="mt-8">
            {isLoading ? (
              <TableSkeleton columns={6} />
            ) : (
              <div className="overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full border-collapse">
                    <thead>
                      <tr className="border border-[#e4e4e4] bg-white">
                        <th className="px-4 py-4 text-left text-base font-bold text-black">
                          Job Title
                        </th>
                        <th className="px-4 py-4 text-center text-base font-bold text-black">
                          Organization
                        </th>
                        <th className="px-4 py-4 text-center text-base font-bold text-black">
                          Location
                        </th>
                        <th className="px-4 py-4 text-center text-base font-bold text-black">
                          Deadline
                        </th>
                        <th className="px-4 py-4 text-center text-base font-bold text-black">
                          Status
                        </th>
                        <th className="px-4 py-4 text-center text-base font-bold text-black">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => {
                        const badge = isAppliedTab
                          ? getStatusBadge(job.status)
                          : getStatusBadge(job.status);
                        return (
                          <tr
                            key={job._id}
                            className="border border-[#e4e4e4] bg-white transition hover:bg-[#f8fbfb]"
                          >
                            <td className="px-4 py-4">
                              <p className="max-w-[200px] truncate text-base text-[#727272]">
                                {job.title}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-center text-base text-[#111]">
                              {job.companyName || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-base text-[#111]">
                              {job.location || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-base text-[#111]">
                              {formatDate(job.deathLine)}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {isAppliedTab ? (
                                <span
                                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}
                                >
                                  {badge.label}
                                </span>
                              ) : (
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
                                      toast.error(
                                        "Failed to update job status",
                                      );
                                    }
                                  }}
                                  className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium border-none outline-none ${badge.bg} ${badge.text}`}
                                >
                                  <option value="open">Running</option>
                                  <option value="closed">Closed</option>
                                  <option value="filled">Filled</option>
                                </select>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2.5">
                                <button
                                  onClick={() => setViewingJob(job)}
                                  className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
                                >
                                  <Eye className="h-5 w-5 text-[#004242]" />
                                </button>
                                {!isAppliedTab && (
                                  <button
                                    onClick={() => setEditingJob(job)}
                                    className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
                                  >
                                    <Pencil className="h-5 w-5 text-[#004242]" />
                                  </button>
                                )}
                                {!isAppliedTab && (
                                  <button
                                    onClick={() => setDeletingId(job._id)}
                                    className="cursor-pointer rounded-full p-2 transition hover:bg-red-50"
                                  >
                                    <Trash2 className="h-5 w-5 text-[#004242]" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {jobs.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-[#7a99b8]"
                          >
                            No opportunities found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {jobs.length > 0 && (
                  <div className="flex flex-col gap-4 rounded-b-lg border border-[#e4e4e4] bg-[#eef4f5] px-12 py-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-base text-[#3b3b3b]">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, meta.total)} of {meta.total}{" "}
                      results
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex h-10 w-10 items-center justify-center rounded border border-[#004242] transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="h-[18px] w-[18px] text-[#004242]" />
                      </button>

                      {getPageNumbers().map((pNum, index) => {
                        if (pNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="flex w-10 h-10 items-center justify-center text-base text-[#1e1e1e]"
                            >
                              ...
                            </span>
                          );
                        }

                        const isActive = pNum === page;
                        return (
                          <button
                            key={`page-${pNum}`}
                            onClick={() => setPage(Number(pNum))}
                            className={`flex h-10 w-10 items-center justify-center rounded transition cursor-pointer text-base ${
                              isActive
                                ? "bg-[#004242] text-white"
                                : "border border-[#004242] text-[#1e1e1e] hover:bg-white"
                            }`}
                          >
                            {pNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() =>
                          setPage((p) => Math.min(meta.totalPage || 1, p + 1))
                        }
                        disabled={page >= (meta.totalPage || 1)}
                        className="flex h-10 w-10 items-center justify-center rounded border border-[#004242] transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronRight className="h-[18px] w-[18px] text-[#004242]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      <EditJobModal
        open={!!editingJob}
        onClose={() => setEditingJob(null)}
        editData={editingJob}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />

      {/* View Details Modal */}
      {viewingJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setViewingJob(null)}
        >
          <div
            className="mx-4 w-full max-w-[500px] rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2c3135]">
                {viewingJob.title}
              </h2>
              <button
                onClick={() => setViewingJob(null)}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-[#5f686d]">Company:</span>{" "}
                <span className="text-[#2c3135]">{viewingJob.companyName}</span>
              </div>
              <div>
                <span className="font-medium text-[#5f686d]">Location:</span>{" "}
                <span className="text-[#2c3135]">{viewingJob.location}</span>
              </div>
              <div>
                <span className="font-medium text-[#5f686d]">Category:</span>{" "}
                <span className="text-[#2c3135]">{viewingJob.category}</span>
              </div>
              <div>
                <span className="font-medium text-[#5f686d]">Job Type:</span>{" "}
                <span className="text-[#2c3135] capitalize">
                  {viewingJob.jobType}
                </span>
              </div>
              {viewingJob.salary && (
                <div>
                  <span className="font-medium text-[#5f686d]">Salary:</span>{" "}
                  <span className="text-[#2c3135]">
                    {viewingJob.salary.min} - {viewingJob.salary.max}{" "}
                    {viewingJob.salary.currency}/{viewingJob.salary.period}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium text-[#5f686d]">Deadline:</span>{" "}
                <span className="text-[#2c3135]">
                  {formatDate(viewingJob.deathLine)}
                </span>
              </div>
              <div>
                <span className="font-medium text-[#5f686d]">Skills:</span>{" "}
                <span className="text-[#2c3135]">{viewingJob.skill}</span>
              </div>
              {viewingJob.description && (
                <div>
                  <span className="font-medium text-[#5f686d] block mb-1">
                    Description:
                  </span>
                  <div
                    className="text-[#2c3135] prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: viewingJob.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
