"use client";

import {
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  Link2,
  MapPin,
  Tag,
  Users,
  X,
} from "lucide-react";
import { Job } from "../types/content.types";

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

const statusStyles: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  open: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Open" },
  filled: { bg: "bg-blue-50", text: "text-blue-700", label: "Filled" },
  closed: { bg: "bg-slate-100", text: "text-slate-600", label: "Closed" },
};

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
    <div className="flex items-center gap-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <div className="text-sm font-semibold text-slate-800 break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function JobDetailsModal({
  job,
  onClose,
}: JobDetailsModalProps) {
  const status = statusStyles[job.status] ?? statusStyles.closed;

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
        className="relative bg-white rounded-xl border border-slate-200 w-full max-w-[720px] max-h-[92vh] flex flex-col overflow-hidden shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─── */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex gap-5 min-w-0">
              {job.companyLogo?.url ? (
                <img
                  src={job.companyLogo.url}
                  alt={job.companyName}
                  className="h-14 w-14 rounded-lg object-contain border border-slate-100 p-2 shrink-0"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                  <Building2 size={28} />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none truncate">
                    {job.title}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border border-current/10`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {job.companyName}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { icon: <Briefcase size={12} />, label: job.jobType },
              { icon: <Tag size={12} />, label: job.category },
              { icon: <MapPin size={12} />, label: job.location },
            ].map(
              (badge, i) =>
                badge.label && (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-md text-xs font-semibold border border-slate-200/60"
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                ),
            )}
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Hiring Progress
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">
                  {job.hiredCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {job.totalHiredCount} seats
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Compensation
              </p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-base font-bold text-slate-900">
                  {job.salary?.currency} {job.salary?.min?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  / {job.salary?.period}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Deadline
              </p>
              <p className="text-sm font-bold text-slate-900">
                {formatDate(job.deathLine)}
              </p>
            </div>
          </div>

          {/* Details Table-style */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
              Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 border-t border-slate-100">
              <DetailRow
                icon={<Users size={16} />}
                label="Skills Required"
                value={job.skill || "—"}
              />
              <DetailRow
                icon={<Clock size={16} />}
                label="Posted Date"
                value={formatDate(job.postedDate || job.createdAt)}
              />
              <DetailRow
                icon={<Building2 size={16} />}
                label="Company Website"
                value={
                  job.companyURL ? (
                    <a
                      href={job.companyURL}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Visit Site <Link2 size={12} />
                    </a>
                  ) : (
                    "Not listed"
                  )
                }
              />
              <DetailRow
                icon={<DollarSign size={16} />}
                label="Full Range"
                value={`${job.salary?.currency}${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}`}
              />
              <DetailRow
                icon={<Link2 size={16} />}
                label="Apply Link"
                value={
                  job.applyUrl ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Apply URL <Link2 size={12} />
                    </a>
                  ) : (
                    "Not listed"
                  )
                }
              />
            </div>
          </section>

          {/* Text Content Sections */}
          {[
            { title: "The Role", content: job.description },
            { title: "Responsibilities", content: job.responsibility },
            { title: "Requirements", content: job.requirement },
          ].map(
            (sec, i) =>
              sec.content && (
                <section key={i} className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {sec.title}
                  </h3>
                  <div
                    className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed bg-white border border-slate-100 p-5 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: sec.content }}
                  />
                </section>
              ),
          )}

          {/* Media Section */}
          {job.media?.images && job.media.images.length > 0 && (
            <section className="pb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                Gallery
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {job.media.images.map((img) => (
                  <img
                    key={img.public_id}
                    src={img.url}
                    alt="Office"
                    className="aspect-square w-full rounded-lg object-cover border border-slate-200 hover:border-slate-400 transition-colors"
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ─── Footer ─── */}
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
