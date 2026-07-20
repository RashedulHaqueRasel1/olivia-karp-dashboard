"use client";

import {
  X,
  Tag,
  Link2,
  FileImage,
  Music,
  Video,
  File,
  Star,
  Globe,
  Clock,
  BookOpen,
} from "lucide-react";
import { Media } from "../types/content.types";

interface MediaDetailsModalProps {
  media: Media;
  onClose: () => void;
}

function mediaTypeIcon(type: string) {
  switch (type) {
    case "audio":
      return <Music size={20} />;
    case "url":
      return <Link2 size={20} />;
    case "files":
      return <File size={20} />;
    default:
      return <FileImage size={20} />;
  }
}

function mediaTypeLabel(type: string) {
  switch (type) {
    case "audio":
      return "Audio";
    case "url":
      return "URL / Link";
    case "files":
      return "File Upload";
    default:
      return type?.replace(/-/g, " ") ?? "Media";
  }
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "muted";
}) {
  const styles = {
    default: "bg-slate-50 text-slate-600 border-slate-200/60",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    muted: "bg-slate-100 text-slate-500 border-slate-200/60",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <div className="text-sm font-semibold text-slate-800 break-all">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function MediaDetailsModal({
  media,
  onClose,
}: MediaDetailsModalProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl border border-slate-200 w-full max-w-[680px] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            {/* Icon + title */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                {mediaTypeIcon(media.mediaType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none truncate">
                    {media.title}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                      media.isPublished
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                        : "bg-slate-100 text-slate-500 border-slate-200/60"
                    }`}
                  >
                    {media.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 capitalize">
                  {mediaTypeLabel(media.mediaType)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {media.category && (
              <Badge>
                <Tag size={12} />
                {media.category}
              </Badge>
            )}
            {media.isFeatured && (
              <Badge variant="success">
                <Star size={12} />
                Featured
              </Badge>
            )}
            {media.mediaType && (
              <Badge variant="muted">
                {mediaTypeIcon(media.mediaType)}
                {mediaTypeLabel(media.mediaType)}
              </Badge>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8">
          {/* Thumbnail */}
          {media.thumbnailImage?.url && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                Thumbnail
              </h3>
              <img
                src={media.thumbnailImage.url}
                alt={media.title}
                className="w-full max-h-56 object-cover rounded-xl border border-slate-200"
              />
            </section>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-base font-bold text-slate-900">
                {media.isPublished ? "Published" : "Draft"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Featured
              </p>
              <p className="text-base font-bold text-slate-900">
                {media.isFeatured ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Detail rows */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
              Details
            </h3>
            <div className="border-t border-slate-100">
              <DetailRow
                icon={<Tag size={16} />}
                label="Category"
                value={media.category || "—"}
              />
              <DetailRow
                icon={<Globe size={16} />}
                label="Media Type"
                value={
                  <span className="capitalize">
                    {mediaTypeLabel(media.mediaType)}
                  </span>
                }
              />
              {media.contentUrl && (
                <DetailRow
                  icon={<Link2 size={16} />}
                  label="Content URL"
                  value={
                    <a
                      href={media.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Open Link <Link2 size={12} />
                    </a>
                  }
                />
              )}
              {media.mediaFile?.url && (
                <DetailRow
                  icon={<File size={16} />}
                  label="Media File"
                  value={
                    <a
                      href={media.mediaFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View File <Link2 size={12} />
                    </a>
                  }
                />
              )}
              <DetailRow
                icon={<Clock size={16} />}
                label="Created At"
                value={formatDate(media.createdAt)}
              />
              <DetailRow
                icon={<Clock size={16} />}
                label="Last Updated"
                value={formatDate(media.updatedAt)}
              />
            </div>
          </section>

          {/* Description */}
          {media.description && (
            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Description
              </h3>
              <div
                className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed bg-white border border-slate-100 p-5 rounded-lg"
                dangerouslySetInnerHTML={{ __html: media.description }}
              />
            </section>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
