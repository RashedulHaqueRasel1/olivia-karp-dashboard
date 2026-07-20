"use client";

import { useState } from "react";
import { Eye, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useSurveys, useDeleteSurvey } from "../hooks/useSurveys";
import type { Survey } from "../types/survey.types";
import UserProfileDrawer from "./UserProfileDrawer";
import DeleteConfirmDialog from "@/features/content-management/component/DeleteConfirmDialog";
import TableSkeleton from "@/features/content-management/component/TableSkeleton";

const CLIMATE_LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  Expert: { bg: "bg-[#ace9ff]", text: "text-[#004242]" },
  Intermediate: { bg: "bg-[#b6edec]", text: "text-[#004242]" },
  Beginner: { bg: "bg-[#c7e7ff]", text: "text-[#004242]" },
};

function getClimateLevel(journey: string): string {
  const lower = journey.toLowerCase();
  if (lower.includes("expert") || lower.includes("professional"))
    return "Expert";
  if (lower.includes("intermediate") || lower.includes("experienced"))
    return "Intermediate";
  return "Beginner";
}

export default function UserDataManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Survey | null>(null);

  const { data, isLoading } = useSurveys({ page, limit: 10, search });
  const deleteMutation = useDeleteSurvey();

  const surveys: Survey[] = data?.data || [];
  const meta = data?.meta;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleView = (survey: Survey) => {
    setSelectedSurvey(survey);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      toast.success("Survey deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete survey");
    }
  };

  const totalPages = meta?.totalPage || 1;

  const getPageNumbers = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#181919]">User Data</h1>
        <p className="text-base text-[#6c6c6c]">Dashboard &gt; User Data</p>
      </div>

      {/* Search */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search by  Category Name "
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-[52px] w-[297px] border border-[#e3ecec] rounded-l-lg pl-4 text-base text-[#004242] placeholder:text-[rgba(0,66,66,0.25)] outline-none"
        />
        <button
          onClick={handleSearch}
          className="h-[52px] w-[60px] bg-[#004242] rounded-r-lg flex items-center justify-center"
        >
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton columns={5} rows={10} />
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[#e4e4e4] bg-white">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e4e4e4] bg-white">
                {["Name", "Location", "Climate Level", "Action"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-4 text-base font-bold text-black ${
                      i === 0 ? "text-left" : "text-center"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {surveys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[#727272]">
                    No user data found.
                  </td>
                </tr>
              ) : (
                surveys.map((survey) => {
                  const location = [survey.city, survey.country]
                    .filter(Boolean)
                    .join(", ");
                  const level = getClimateLevel(survey.climateJourney);
                  const levelStyle = CLIMATE_LEVEL_STYLES[level] || {
                    bg: "bg-[#c7e7ff]",
                    text: "text-[#004242]",
                  };

                  return (
                    <tr
                      key={survey._id}
                      className="border-b border-[#e4e4e4] hover:bg-[#f9fafb] transition-colors"
                    >
                      <td className="px-4 py-4 text-base text-[#727272] truncate max-w-[230px]">
                        {survey.name}
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-black text-center">
                        {location}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${levelStyle.bg} ${levelStyle.text}`}
                        >
                          {level}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => handleView(survey)}
                            className="p-2 rounded-full hover:bg-[#eef4f5] transition-colors"
                          >
                            <Eye className="h-6 w-6 text-[#004242]" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(survey)}
                            className="p-0 hover:opacity-70 transition-opacity"
                          >
                            <Trash2 className="h-6 w-6 text-[#004242]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between px-[50px] py-5 bg-[#eef4f5] border-t border-[#e4e4e4] rounded-b-[8px]">
              <p className="text-base text-[#3b3b3b]">
                Showing {(page - 1) * (meta.limit || 10) + 1} to{" "}
                {Math.min(page * (meta.limit || 10), meta.total)} of{" "}
                {meta.total} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-10 h-10 border border-[#004242] rounded flex items-center justify-center disabled:opacity-50 hover:bg-white transition-colors cursor-pointer"
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
                      className={`w-10 h-10 rounded flex items-center justify-center text-base transition cursor-pointer ${
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="w-10 h-10 border border-[#004242] rounded flex items-center justify-center disabled:opacity-50 hover:bg-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-[18px] w-[18px] text-[#004242]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Drawer */}
      <UserProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        survey={selectedSurvey}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User Data"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
