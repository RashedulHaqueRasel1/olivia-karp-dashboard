"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification } from "../types/notification.types";
import NotificationDetailModal from "./NotificationDetailModal";
import TableSkeleton from "@/features/content-management/component/TableSkeleton";

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> =
  {
    job: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]", label: "Job Post" },
    blog: { bg: "bg-[#eef4f5]", text: "text-[#004242]", label: "Blog Post" },
    "course-idea": {
      bg: "bg-[#f3e8ff]",
      text: "text-[#7e22ce]",
      label: "Course Idea",
    },
    "speaker-engagement": {
      bg: "bg-[#dbeafe]",
      text: "text-[#1d4ed8]",
      label: "Speaker Engagement",
    },
    interview: {
      bg: "bg-[#f3e8ff]",
      text: "text-[#7e22ce]",
      label: "Interview",
    },
    podcast: { bg: "bg-[#f3e8ff]", text: "text-[#7e22ce]", label: "Podcast" },
  };

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-[#fff4e5]",
    text: "text-[#b26a00]",
    label: "Pending",
  },
  accepted: {
    bg: "bg-[#e6f4ea]",
    text: "text-[#1e7e34]",
    label: "Accepted",
  },
  rejected: {
    bg: "bg-[#fde8e8]",
    text: "text-[#c62828]",
    label: "Rejected",
  },
  read: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Read",
  },
};

const STAT_CARDS = [
  { label: "Job Posts", key: "jobPosts", color: "text-[#004242]" },
  {
    label: "Job Applications",
    key: "jobApplications",
    color: "text-[#004242]",
  },
  { label: "Blog Posts", key: "blogPosts", color: "text-[#004242]" },
  {
    label: "Suggest a Course Idea",
    key: "courseIdeas",
    color: "text-[#004242]",
  },
];

export default function NotificationManagement() {
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useNotifications({ page, limit: 10 });

  const notifications: Notification[] = data?.data || [];
  const meta = data?.meta;

  // Compute stat counts from data
  const stats = {
    jobPosts: notifications.filter((n) => n.type === "job").length,
    jobApplications: notifications.filter(
      (n) =>
        n.type === "interview" ||
        n.type === "podcast" ||
        n.type === "speaker-engagement",
    ).length,
    blogPosts: notifications.filter((n) => n.type === "blog").length,
    courseIdeas: notifications.filter((n) => n.type === "course-idea").length,
  };

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#2c3135]">Notification</h1>
        <p className="text-sm text-[#6b7280]">Dashboard &gt; Notification</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-[#d8dfdf] bg-white p-5"
          >
            <p className="text-sm text-[#6b7280]">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {stats[card.key as keyof typeof stats] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton columns={6} rows={8} />
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[#d8dfdf] bg-white">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#d8dfdf] bg-white">
                {[
                  "Title",
                  "Type",
                  "Submitted By",
                  "Date",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-sm font-semibold text-[#2c3135]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#6b7280]">
                    No notifications found.
                  </td>
                </tr>
              ) : (
                notifications.map((n) => {
                  const typeStyle = TYPE_STYLES[n.type] || {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    label: n.type,
                  };
                  const statusStyle = STATUS_STYLES[n.status] || {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    label: n.status,
                  };
                  const submitterName = n.submittedBy
                    ? `${n.submittedBy.firstName} ${n.submittedBy.lastName}`
                    : "—";

                  return (
                    <tr
                      key={n._id}
                      className="border-b border-[#d8dfdf] hover:bg-[#f9fafb] transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm text-[#2c3135] max-w-[250px] truncate">
                        {n.title}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
                        >
                          {typeStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#2c3135]">
                        {submitterName}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#6b7280]">
                        {formatDate(n.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleView(n)}
                          className="w-8 h-8 rounded-full bg-[#004242] text-white flex items-center justify-center hover:bg-[#003535] transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#d8dfdf]">
              <p className="text-sm text-[#6b7280]">
                Page {meta.page} of {meta.totalPage} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[#d8dfdf] disabled:opacity-50 hover:bg-[#f9fafb] transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPage, p + 1))
                  }
                  disabled={page >= meta.totalPage}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[#d8dfdf] disabled:opacity-50 hover:bg-[#f9fafb] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <NotificationDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notification={selectedNotification}
      />
    </div>
  );
}
