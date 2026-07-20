"use client";

import Link from "next/link";
import { Briefcase, Video, FileText, Calendar } from "lucide-react";

const contentSections = [
  {
    title: "Job Posts",
    description:
      "Manage job listings, create new positions, and track applications.",
    icon: Briefcase,
    href: "/content-management/create-job-post",
    color: "bg-[#004f52]",
  },
  {
    title: "Media Posts",
    description:
      "Manage media content including interviews, documentaries, and podcasts.",
    icon: Video,
    href: "/content-management/create-media-post",
    color: "bg-[#2d9f6f]",
  },
  {
    title: "Blog Posts",
    description: "Manage blog articles, categories, and author profiles.",
    icon: FileText,
    href: "/content-management/create-blog-post",
    color: "bg-[#5b7fc7]",
  },
  {
    title: "Event Posts",
    description: "Manage event links, publish or unpublish events.",
    icon: Calendar,
    href: "/content-management/create-event-post",
    color: "bg-[#f4845f]",
  },
];

export default function ContentManagement() {
  return (
    <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#2c3135] md:text-[22px]">
            Content Management
          </h1>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span>Content Management</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contentSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-[#d8dfdf] bg-white p-6 transition-all hover:shadow-lg hover:border-[#004f52]/30"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${section.color} text-white mb-4`}
              >
                <section.icon className="h-6 w-6" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#2c3135] group-hover:text-[#004f52] transition-colors">
                {section.title}
              </h3>
              <p className="mt-2 text-[13px] text-[#7b848a] leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
