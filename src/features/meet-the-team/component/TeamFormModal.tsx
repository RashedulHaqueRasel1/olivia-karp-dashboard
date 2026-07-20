"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { X, UploadCloud, Info } from "lucide-react";
import {
  useCreateTeamMember,
  useUpdateTeamMember,
} from "../hooks/useMeetTheTeam";
import { TeamMember } from "../types/meetTheTeam.types";

type TeamFormValues = {
  name: string;
  designation: string;
  description: string;
  linkedIn: string;
  instagram: string;
  facebook: string;
  twitter: string;
  x: string;
  youtube: string;
  website: string;
};

interface TeamFormModalProps {
  mode: "add" | "edit";
  member?: TeamMember | null;
  onClose: () => void;
}

const socialKeyFromPlatform: Record<
  string,
  keyof Pick<
    TeamFormValues,
    | "linkedIn"
    | "instagram"
    | "facebook"
    | "twitter"
    | "x"
    | "youtube"
    | "website"
  >
> = {
  linkedin: "linkedIn",
  instagram: "instagram",
  facebook: "facebook",
  twitter: "twitter",
  x: "x",
  youtube: "youtube",
  website: "website",
};

function buildDefaults(member?: TeamMember | null): TeamFormValues {
  const base: TeamFormValues = {
    name: member?.name || "",
    designation: member?.designation || "",
    description: member?.description || "",
    linkedIn: "",
    instagram: "",
    facebook: "",
    twitter: "",
    x: "",
    youtube: "",
    website: "",
  };

  member?.socialLinks?.forEach((link) => {
    const key = socialKeyFromPlatform[(link.platform || "").toLowerCase()];
    if (key && link.url) base[key] = link.url;
  });

  return base;
}

export function TeamFormModal({ mode, member, onClose }: TeamFormModalProps) {
  const isEdit = mode === "edit";
  const { mutate: createMember, isPending: isCreating } = useCreateTeamMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateTeamMember();
  const isPending = isCreating || isUpdating;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    member?.profilePicture?.url || null,
  );
  const objectUrlRef = useRef<string | null>(null);

  const { register, handleSubmit } = useForm<TeamFormValues>({
    defaultValues: buildDefaults(member),
  });

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (f) {
      const url = URL.createObjectURL(f);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(member?.profilePicture?.url || null);
    }
  };

  const onSubmit = (data: TeamFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("description", data.description);

    (
      [
        "linkedIn",
        "instagram",
        "facebook",
        "twitter",
        "x",
        "youtube",
        "website",
      ] as const
    ).forEach((key) => {
      const val = data[key]?.trim();
      if (val) formData.append(key, val);
    });

    if (file) formData.append("profilePicture", file);

    if (isEdit && member?._id) {
      updateMember(
        { id: member._id, data: formData },
        { onSuccess: () => onClose() },
      );
    } else {
      createMember(formData, { onSuccess: () => onClose() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#001014]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f4] text-[#5b6e70] transition hover:bg-[#e0e6e6]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 border-b border-[#e6ebeb] pb-4">
          <h2 className="text-2xl font-bold text-[#1a2326]">
            {isEdit ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <p className="mt-1 text-sm text-[#7a99b8]">
            {isEdit
              ? "Update team member details and save changes."
              : "Fill in the details to add a new member to your team."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4a5559]">
              Profile Image
            </span>
            <div className="relative mt-1 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#8db3b5] px-6 py-6 transition hover:bg-[#f8fbfb]">
              <input
                type="file"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                accept="image/png, image/jpeg, image/jpg, image/webp"
              />
              {previewUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#d6dddd]">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm text-[#004f52]">
                    {file ? (
                      <span className="font-semibold">{file.name}</span>
                    ) : (
                      <span>Click to change image</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-[#004f52]" />
                  <div className="mt-3 flex justify-center text-sm leading-6 text-gray-600">
                    <span className="font-semibold text-[#004f52]">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              )}
            </div>
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                Name <span className="text-red-500">*</span>
              </span>
              <input
                {...register("name", { required: true })}
                className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                placeholder="Jane Doe"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                Designation <span className="text-red-500">*</span>
              </span>
              <input
                {...register("designation", { required: true })}
                className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                placeholder="Head of Research"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#4a5559]">
              Description <span className="text-red-500">*</span>
            </span>
            <textarea
              {...register("description", { required: true })}
              rows={3}
              className="w-full resize-none rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
              placeholder="Short bio or description"
            />
          </label>

          <div className="rounded-xl border border-[#e0e8e8] bg-[#f8fbfb] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1a2326]">
              Social Links
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  LinkedIn
                </span>
                <input
                  {...register("linkedIn")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://linkedin.com/..."
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  Instagram
                </span>
                <input
                  {...register("instagram")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://instagram.com/..."
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  Facebook
                </span>
                <input
                  {...register("facebook")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://facebook.com/..."
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  Twitter
                </span>
                <input
                  {...register("twitter")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://twitter.com/..."
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  X
                </span>
                <input
                  {...register("x")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://x.com/..."
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  YouTube
                </span>
                <input
                  {...register("youtube")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://youtube.com/..."
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-medium text-[#4a5559]">
                  Website
                </span>
                <input
                  {...register("website")}
                  className="w-full rounded-lg border border-[#d6dddd] px-3 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="https://..."
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#e6ebeb] pt-5">
            <div className="mr-auto flex items-center text-xs text-[#7a99b8]">
              <Info className="mr-1.5 h-4 w-4" /> Required fields marked with *
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border border-[#d6dddd] cursor-pointer px-6 py-2.5 text-[14px] font-semibold text-[#5b6e70] transition hover:bg-[#f8fbfb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-w-[140px] cursor-pointer items-center justify-center rounded-[8px] bg-[#004f52] px-8 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-[#004f52]/20 transition hover:bg-[#003d40] disabled:opacity-70"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
