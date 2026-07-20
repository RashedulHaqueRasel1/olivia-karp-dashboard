"use client";

import { X, MapPin, ExternalLink } from "lucide-react";
import type { Survey } from "../types/survey.types";

interface UserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  survey: Survey | null;
}

export default function UserProfileDrawer({
  open,
  onClose,
  survey,
}: UserProfileDrawerProps) {
  if (!survey) return null;

  const location = [survey.city, survey.country].filter(Boolean).join(", ");

  // Derive climate level from climateJourney text
  const getClimateLevel = (journey: string) => {
    const lower = journey.toLowerCase();
    if (lower.includes("expert") || lower.includes("professional"))
      return "Expert";
    if (lower.includes("intermediate") || lower.includes("experienced"))
      return "Intermediate";
    return "Learning & exploring";
  };

  const climateLevel = getClimateLevel(survey.climateJourney);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/25 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white z-50 shadow-[-10px_0px_40px_0px_rgba(0,0,0,0.1)] border-l border-[#ebeeee] transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-[25px] border-b border-[#ebeeee]">
          <h3 className="text-[20px] font-black text-[#002a2a]">
            User Profile
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-[#002a2a]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 space-y-10 overflow-y-auto h-[calc(100%-80px)] pb-8">
          {/* Basic Info */}
          <div className="flex items-start gap-0">
            <div className="w-24 h-24 rounded-xl bg-[#eef4f5] flex items-center justify-center text-[#004242] text-2xl font-bold flex-shrink-0">
              {survey.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="pl-6 flex flex-col gap-1">
              <h4 className="text-2xl font-black text-[#002a2a]">
                {survey.name}
              </h4>
              {location && (
                <div className="flex items-center gap-1 text-sm text-[#404848]">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </div>
              )}
              {survey.link && (
                <div className="pt-3">
                  <a
                    href={survey.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#004242] hover:underline"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Climate Journey */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-[#404848] uppercase tracking-wide">
              Climate Journey
            </h5>
            <div className="bg-[#f1f4f4] rounded-2xl p-5 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#246679] text-white text-[10px] font-bold uppercase">
                {climateLevel}
              </span>
              <p className="text-sm text-[#181c1d] leading-relaxed">
                {survey.climateJourney}
              </p>
            </div>
          </div>

          {/* Interests & Goals */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-[#404848] uppercase tracking-wide">
                Interests
              </h5>
              <div className="flex flex-col gap-2">
                {survey.interest.map((item, i) => (
                  <span
                    key={i}
                    className="inline-block w-fit px-3 py-1.5 rounded-lg bg-[#e6e9e9] text-[11px] font-medium text-[#002a2a]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-[#404848] uppercase tracking-wide">
                Goals
              </h5>
              <div className="flex flex-wrap gap-2">
                {survey.goals.map((goal, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#eef4f5] text-[11px] font-bold text-[#004242]"
                  >
                    {goal}
                  </span>
                ))}
              </div>
              {survey.successMessage && (
                <p className="text-xs text-[#404848] leading-4">
                  &ldquo;{survey.successMessage}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Career & Community */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-[#404848] uppercase tracking-wide">
                Career
              </h5>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#404848]">Looking for:</p>
                  <p className="text-sm font-bold text-[#181c1d]">
                    {survey.opportunity || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#404848]">Engagement:</p>
                  <p className="text-sm font-bold text-[#181c1d]">
                    {survey.engagementPreference || "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-[#404848] uppercase tracking-wide">
                Community
              </h5>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#404848]">Hubs:</p>
                  <p className="text-sm font-bold text-[#181c1d]">
                    {survey.hubs || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#404848]">Region:</p>
                  <p className="text-sm font-bold text-[#181c1d]">
                    {survey.region || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Communication & Personal Note */}
          <div className="border-t border-[rgba(191,200,199,0.2)] pt-4 space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-[#404848] uppercase tracking-wide">
                Communication
              </h5>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <span className="text-[#404848]">
                  Newsletters:{" "}
                  <span
                    className={
                      survey.impactNewsletter
                        ? "text-[#246679]"
                        : "text-[#ba1a1a]"
                    }
                  >
                    {survey.impactNewsletter ? "ON" : "OFF"}
                  </span>
                </span>
                <span className="text-[#404848]">
                  Events:{" "}
                  <span
                    className={
                      survey.localNotification
                        ? "text-[#246679]"
                        : "text-[#ba1a1a]"
                    }
                  >
                    {survey.localNotification ? "ON" : "OFF"}
                  </span>
                </span>
              </div>
            </div>

            {survey.message && (
              <div className="bg-[rgba(0,42,42,0.05)] border-l-4 border-[#002a2a] rounded-xl px-5 py-4 space-y-1">
                <p className="text-xs font-bold text-[#004242]">
                  Personal Note:
                </p>
                <p className="text-sm text-[#181c1d] leading-5">
                  &ldquo;{survey.message}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
