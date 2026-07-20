"use client";

import { AlertTriangle, X } from "lucide-react";
import { useDeleteTeamMember } from "../hooks/useMeetTheTeam";
import { TeamMember } from "../types/meetTheTeam.types";

interface DeleteTeamModalProps {
  member: TeamMember;
  onClose: () => void;
}

export function DeleteTeamModal({ member, onClose }: DeleteTeamModalProps) {
  const { mutate: deleteMember, isPending } = useDeleteTeamMember();

  const handleDelete = () => {
    deleteMember(member._id, { onSuccess: () => onClose() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#001014]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f4] text-[#5b6e70] transition hover:bg-[#e0e6e6]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#1a2326]">
            Delete Team Member?
          </h2>
          <p className="mt-2 text-sm text-[#6b8a8c]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#1a2326]">{member.name}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-[8px] border border-[#d6dddd] px-5 py-2.5 text-[14px] font-semibold text-[#5b6e70] transition hover:bg-[#f8fbfb] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex min-w-[110px] items-center justify-center rounded-[8px] bg-red-500 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
