"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Upload,
} from "lucide-react";
import { MentorCoach, Meta } from "../types/mentor.types";
import { MentorProfileModal } from "./MentorProfileModal";
import { AddMentorModal } from "./AddMentorModal";
import { BulkUploadModal } from "./BulkUploadModal";
import {
  useMentorsCoaches,
  useApproveMentorCoach,
} from "../hooks/useMentorsCoaches";

function getRandomLocation() {
  return "San Francisco, US";
}

function getBadgeColor(index: number) {
  const colors = [
    "bg-[#e9f8ea] text-[#5fa56b]",
    "bg-[#eaf4ff] text-[#6e9ed9]",
    "bg-[#f1ebff] text-[#9075d8]",
    "bg-[#fff2e8] text-[#d58a53]",
  ];
  return colors[index % colors.length];
}

function MentorCard({
  item,
  onViewProfile,
}: {
  item: MentorCoach;
  onViewProfile: (item: MentorCoach) => void;
}) {
  const { mutate: approveCoach, isPending } = useApproveMentorCoach();
  const fullName = `${item.firstName} ${item.lastName}`;
  const shortDescription =
    item.about ||
    item.bio ||
    "Experienced mentor helping professionals improve their skills and leadership.";

  const maxLength = 120;
  const isLong = shortDescription.length > maxLength;
  const truncatedDescription = isLong
    ? shortDescription.slice(0, maxLength).trim() + "..."
    : shortDescription;

  // Clean and split skills to prevent huge tag bubbles
  const processedSkills: string[] = [];
  const rawSkills = item.skills || [];
  rawSkills.forEach((skill) => {
    const parts = skill.split(/[\n.,;]+/);
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed && trimmed.length > 1) {
        const cleaned =
          trimmed.length > 25 ? trimmed.slice(0, 22) + "..." : trimmed;
        processedSkills.push(cleaned);
      }
    });
  });

  const tags = [
    ...(item.support?.map((s) => s.title) || []),
    ...processedSkills,
  ].slice(0, 3);

  return (
    <div className="rounded-[10px] border border-[#dde7eb] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[380px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-[8px]">
            <Image
              src={item.image?.url || "/images/profile.png"}
              alt={fullName}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#31c95f]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[16px] font-semibold leading-none text-[#384148] truncate max-w-[150px]">
                {fullName}
              </h3>
              <span className="rounded-full bg-[#eef3ff] px-2 py-0.5 text-[10px] text-[#6f8cff] font-bold shrink-0">
                {item.type === "mentor" ? "Mentor" : "Coach"}
              </span>
            </div>

            <p
              className="mt-1 text-[12px] leading-4 text-[#8a939a] line-clamp-1"
              title={item.bio || item.designation}
            >
              {item.bio || item.designation || "VP of Product"}
            </p>
            <p className="text-[12px] leading-4 text-[#8a939a]">Stripe</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[12px] text-[#7a99b8]">
          <MapPin className="h-3.5 w-3.5" />
          <span>{getRandomLocation()}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={`rounded-full px-2.5 py-1 text-[10px] ${getBadgeColor(
                index,
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-[#676f75]">
          {truncatedDescription}{" "}
          {isLong && (
            <button
              onClick={() => onViewProfile(item)}
              className="text-[#004f52] font-semibold hover:underline cursor-pointer ml-1 inline-block"
            >
              more
            </button>
          )}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-2 border-t border-[#f0f4f5]">
        <button
          onClick={() => onViewProfile(item)}
          className="flex-1 rounded-[8px] border-2 border-[#004f52] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#004f52] transition cursor-pointer bg-[#f4fbfb] hover:bg-[#eaf5f5]"
        >
          View Profile
        </button>

        {!item.isApproved && (
          <button
            onClick={() => approveCoach(item._id)}
            disabled={isPending}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[8px] bg-[#31c95f] text-white transition hover:bg-[#24a148] disabled:opacity-50 cursor-pointer"
            title="Approve"
          >
            {isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MentorsCoaches() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [type, setType] = useState<string>("");
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<MentorCoach | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useMentorsCoaches({
    page,
    limit,
    ...(type && { type }),
    ...(isApproved !== null && { isApproved }),
  });

  const mentors: MentorCoach[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f8]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#004f52] border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f8]">
        <p className="text-[#d9534f]">Failed to load mentors and coaches.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#2c3135] md:text-[22px]">
              Mentors & Coaches Directory
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>›</span>
              <span>Mentors & Coaches</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="inline-flex h-[42px] min-w-[120px] items-center justify-center gap-2 rounded-[8px] border border-[#d6dddd] bg-white px-3 text-[14px] text-[#32545b] outline-none transition hover:bg-[#f8fbfb] cursor-pointer"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Types</option>
              <option value="mentor">Mentors</option>
              <option value="coach">Coaches</option>
            </select>

            <select
              className="inline-flex h-[42px] min-w-[130px] items-center justify-center gap-2 rounded-[8px] border border-[#d6dddd] bg-white px-3 text-[14px] text-[#32545b] outline-none transition hover:bg-[#f8fbfb] cursor-pointer"
              value={isApproved === null ? "" : String(isApproved)}
              onChange={(e) => {
                const val = e.target.value;
                setIsApproved(val === "" ? null : val === "true");
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>

            <button
              onClick={() => setIsBulkUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-[#004f52] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#004f52] transition hover:bg-[#f4fbfb] cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#003d40] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Mentor/Coach
            </button>
          </div>
        </div>

        <div className="mt-6 border-b border-[#d9e0e0]">
          <div className="flex flex-wrap items-center gap-8">
            <button className="relative pb-3 text-[15px] font-semibold text-[#2e3438]">
              {isApproved === null
                ? "All"
                : isApproved
                  ? "Approved"
                  : "Pending"}{" "}
              Mentor/Coaches
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${
                  isApproved === false
                    ? "bg-[#fff2e8] text-[#d58a53]"
                    : "bg-[#dff6e7] text-[#2a9a59]"
                }`}
              >
                {meta.total}
              </span>
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#0b6770]" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((item) => (
            <MentorCard
              key={item._id}
              item={item}
              onViewProfile={setSelectedMentor}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[8px] bg-[#eef3f4] px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-[14px] text-[#5f686d]">
            Showing {meta.total === 0 ? 0 : (page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, meta.total)} of {meta.total} results
          </p>

          {meta.totalPage > 0 && (
            <div className="flex items-center gap-2">
              <button
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] bg-white text-[#5b6e70] transition hover:bg-[#f4fbfb] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((pNum, index) => {
                if (pNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-[34px] w-[34px] items-center justify-center text-[#5b6e70]"
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
                    className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] px-3 text-[14px] font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-[#004f52] text-white"
                        : "border border-[#7f9da0] bg-white text-[#5b6e70] hover:bg-[#f4fbfb]"
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] bg-white text-[#5b6e70] transition hover:bg-[#f4fbfb] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPage}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedMentor && (
        <MentorProfileModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}

      {isAddModalOpen && (
        <AddMentorModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {isBulkUploadModalOpen && (
        <BulkUploadModal onClose={() => setIsBulkUploadModalOpen(false)} />
      )}
    </section>
  );
}
