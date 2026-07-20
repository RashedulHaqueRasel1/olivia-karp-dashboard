"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import { useTeamMembers } from "../hooks/useMeetTheTeam";
import { Meta, SocialLink, TeamMember } from "../types/meetTheTeam.types";
import { TeamFormModal } from "./TeamFormModal";
import { DeleteTeamModal } from "./DeleteTeamModal";

function renderSocialIcon(platform?: string) {
  const key = (platform || "").toLowerCase();
  const className = "h-4 w-4";
  if (key.includes("insta")) return <FaInstagram className={className} />;
  if (key.includes("linkedin") || key === "in")
    return <FaLinkedinIn className={className} />;
  if (key.includes("twitter") || key === "x")
    return <FaTwitter className={className} />;
  if (key.includes("facebook") || key === "fb")
    return <FaFacebookF className={className} />;
  if (key.includes("youtube")) return <FaYoutube className={className} />;
  return <Globe className={className} />;
}

function SocialButton({ link }: { link: SocialLink }) {
  if (!link.url) return null;
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#004f52] hover:text-[#004f52]"
      aria-label={link.platform || "Social link"}
    >
      {renderSocialIcon(link.platform)}
    </Link>
  );
}

function TeamMemberDetailModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-xl border border-slate-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header accent */}
        <div className="h-1 w-full bg-[#004f52]" />

        {/* Profile header */}
        <div className="flex items-start gap-5 px-6 pt-6 pb-5 border-b border-slate-100">
          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border-2 border-[#004f52]/20 bg-slate-50 ring-4 ring-[#eef6f6]">
            <Image
              src={member.profilePicture?.url || "/images/profile.png"}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 pt-1">
            <h2 className="text-[17px] font-bold text-[#1a2326] leading-snug">
              {member.name}
            </h2>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#004f52]">
              {member.designation}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto shrink-0 p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {member.description && (
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
                About
              </p>
              <p className="text-[13px] leading-[1.75] text-slate-600">
                {member.description}
              </p>
            </div>
          )}

          {member.socialLinks && member.socialLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                Connect
              </p>
              <div className="flex flex-wrap gap-2">
                {member.socialLinks.map((link, i) => (
                  <SocialButton key={link._id || i} link={link} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  item,
  onEdit,
  onDelete,
  onView,
}: {
  item: TeamMember;
  onEdit: (m: TeamMember) => void;
  onDelete: (m: TeamMember) => void;
  onView: (m: TeamMember) => void;
}) {
  const TRUNCATE_CHARS = 100;
  const isLong = (item.description?.length ?? 0) > TRUNCATE_CHARS;
  const shortDesc = isLong
    ? item.description!.slice(0, TRUNCATE_CHARS).trimEnd() + "…"
    : item.description;

  return (
    <div className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-white text-center transition-colors hover:border-[#004f52]/40">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-[#004f52]" />

      {/* Action buttons — visible on hover */}
      <div className="absolute right-3 top-4 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(item)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-[#004f52] hover:text-[#004f52] cursor-pointer"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:text-red-500 cursor-pointer"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col items-center px-6 pb-6 pt-7">
        {/* Avatar with ring */}
        <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full border-2 border-[#004f52]/20 bg-slate-50 ring-4 ring-[#eef6f6]">
          <Image
            src={item.profilePicture?.url || "/images/profile.png"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Name & designation */}
        <h3 className="mt-4 text-[16px] font-bold leading-snug text-[#1a2326]">
          {item.name}
        </h3>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#004f52]">
          {item.designation}
        </p>

        {/* Description — truncated */}
        {item.description && (
          <p className="mt-3 max-w-[240px] text-[12px] leading-[1.6] text-slate-500">
            {shortDesc}
            {isLong && (
              <button
                onClick={() => onView(item)}
                className="ml-1 font-semibold text-[#004f52] hover:underline cursor-pointer"
              >
                See more
              </button>
            )}
          </p>
        )}

        {/* Social links */}
        {item.socialLinks && item.socialLinks.length > 0 && (
          <>
            <div className="my-5 h-px w-full bg-slate-100" />
            <div className="flex items-center justify-center gap-2">
              {item.socialLinks.map((link, index) => (
                <SocialButton key={link._id || index} link={link} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MeetTheTeam() {
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [viewTarget, setViewTarget] = useState<TeamMember | null>(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useTeamMembers({ page, limit });

  const members: TeamMember[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit,
    total: 0,
    totalPage: 0,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#004f52] border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#d9534f]">Failed to load team members.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f8f8] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1300px]">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-[#2c3135] md:text-[24px]">
              Meet The Team
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>›</span>
              <span>Meet The Team</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#003d40] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </button>
        </div>

        {/* Content card */}
        <div className="rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
          {members.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[14px] text-[#7b848a]">
                No team members found. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((item) => (
                <TeamCard
                  key={item._id}
                  item={item}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                  onView={setViewTarget}
                />
              ))}
            </div>
          )}

          {meta.totalPage > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#d8dfdf] pt-5">
              <button
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] bg-[#004f52] px-3 text-[13px] font-medium text-white">
                {page}
              </button>

              <button
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPage}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {viewTarget && (
        <TeamMemberDetailModal
          member={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      {isAddOpen && (
        <TeamFormModal mode="add" onClose={() => setIsAddOpen(false)} />
      )}

      {editTarget && (
        <TeamFormModal
          mode="edit"
          member={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteTeamModal
          member={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
