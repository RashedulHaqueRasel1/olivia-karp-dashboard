"use client";

import { useCallback, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  useEvents,
  useTogglePublishEvent,
  useDeleteEvent,
} from "../hooks/useEvents";
import { Event, Meta } from "../types/content.types";
import EventPostModal from "./EventPostModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import TableSkeleton from "./TableSkeleton";
import { toast } from "sonner";

export default function EventPostPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const { data: response, isLoading, isError } = useEvents({ page, limit });
  const deleteMutation = useDeleteEvent();
  const togglePublishMutation = useTogglePublishEvent();

  const events: Event[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

  const handleDelete = useCallback(async () => {
    if (!deletingEventId) return;
    try {
      await deleteMutation.mutateAsync(deletingEventId);
      toast.success("Event deleted successfully");
      setDeletingEventId(null);
    } catch {
      toast.error("Failed to delete event");
    }
  }, [deletingEventId, deleteMutation]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingEventId) return;
    try {
      await deleteMutation.mutateAsync(deletingEventId);
      toast.success("Event deleted successfully");
      setDeletingEventId(null);
    } catch {
      toast.error("Failed to delete event");
    }
  }, [deletingEventId, deleteMutation]);

  const handleTogglePublish = useCallback(
    async (event: Event) => {
      try {
        await togglePublishMutation.mutateAsync({
          eventId: event._id,
          isPublished: !event.isPublished,
        });
        toast.success(
          event.isPublished ? "Event unpublished" : "Event published",
        );
      } catch {
        toast.error("Failed to update event status");
      }
    },
    [togglePublishMutation],
  );

  if (isError) {
    return (
      <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
        <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
          <div className="flex items-center justify-center py-20">
            <p className="text-[#d9534f]">
              Failed to load events data. Please try again later.
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
              Event Posts
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span>Content Management</span>
              <span>&gt;</span>
              <span>Event Posts</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#003d40] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton columns={4} />
          ) : (
            <div className="overflow-hidden rounded-[8px] border border-[#d8dfdf] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#d8dfdf] bg-white">
                      <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                        Luma URL
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Created At
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr
                        key={event._id}
                        className={`border-b border-[#d8dfdf] transition hover:bg-[#f8fbfb] ${index === events.length - 1 ? "border-b-0" : ""}`}
                      >
                        <td className="px-4 py-4">
                          <a
                            href={event.lumaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#004f52] hover:underline text-[14px]"
                          >
                            <span className="max-w-[350px] truncate">
                              {event.lumaUrl}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                          </a>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleTogglePublish(event)}
                            disabled={togglePublishMutation.isPending}
                            className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer transition ${
                              event.isPublished
                                ? "bg-[#cdeed9] text-[#0d6b42] hover:bg-[#b8e5c8]"
                                : "bg-[#fef6e0] text-[#c5a543] hover:bg-[#fdefc0]"
                            }`}
                          >
                            {event.isPublished ? "Published" : "Unpublished"}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center text-[14px] text-[#5f686d]">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-5">
                            <button
                              onClick={() => setDeletingEventId(event._id)}
                              className="transition hover:opacity-70 p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-12 text-center text-[#7a99b8]"
                        >
                          No events found. Create one to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {events.length > 0 && (
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

      <EventPostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <DeleteConfirmDialog
        open={!!deletingEventId}
        onClose={() => setDeletingEventId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}
