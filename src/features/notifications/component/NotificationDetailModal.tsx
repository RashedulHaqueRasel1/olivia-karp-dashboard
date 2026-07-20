"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar } from "lucide-react";
import type { Notification } from "../types/notification.types";

interface NotificationDetailModalProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}

function getTypeBadge(type: string) {
  switch (type) {
    case "job":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#1d4ed8]">
          Job Post
        </span>
      );
    case "blog":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#eef4f5] text-[#004242]">
          Blog Post
        </span>
      );
    case "course-idea":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f3e8ff] text-[#7e22ce]">
          Course Idea
        </span>
      );
    case "speaker-engagement":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#1d4ed8]">
          Speaker Engagement
        </span>
      );
    case "interview":
    case "podcast":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f3e8ff] text-[#7e22ce]">
          {type === "interview" ? "Interview" : "Podcast"}
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {type}
        </span>
      );
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fff4e5] text-[#b26a00]">
          Pending
        </span>
      );
    case "accepted":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#1e7e34]">
          Accepted
        </span>
      );
    case "rejected":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fde8e8] text-[#c62828]">
          Rejected
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
}

export default function NotificationDetailModal({
  open,
  onClose,
  notification,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const user = notification.submittedBy;
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  const isSpeakerOrInterview =
    notification.type === "speaker-engagement" ||
    notification.type === "interview" ||
    notification.type === "podcast";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2c3135]">
            Notification Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* User header */}
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-[#eef4f5] text-[#004242] text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#2c3135]">{fullName}</span>
                {getStatusBadge(notification.status)}
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6b7280] mt-0.5">
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </span>
                )}
                {getTypeBadge(notification.type)}
              </div>
            </div>
          </div>

          {/* Request type & date for interview/podcast */}
          {isSpeakerOrInterview && notification.requestType && (
            <div className="flex items-center gap-4 text-sm text-[#6b7280]">
              <span>
                Request Type:{" "}
                <strong className="text-[#2c3135]">
                  {notification.requestType}
                </strong>
              </span>
              {notification.preferredDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(notification.preferredDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          {notification.title && (
            <div>
              <h4 className="text-sm font-medium text-[#6b7280] mb-1">Title</h4>
              <p className="text-sm text-[#2c3135]">{notification.title}</p>
            </div>
          )}

          {/* Description / Message */}
          {(notification.description || notification.message) && (
            <div>
              <h4 className="text-sm font-medium text-[#6b7280] mb-1">
                Description
              </h4>
              <p className="text-sm text-[#2c3135]">
                {notification.description || notification.message}
              </p>
            </div>
          )}

          {/* Specialization */}
          {notification.specialization && (
            <div>
              <h4 className="text-sm font-medium text-[#6b7280] mb-1">
                Specialization
              </h4>
              <p className="text-sm text-[#2c3135]">
                {notification.specialization}
              </p>
            </div>
          )}

          {/* Industry */}
          {notification.industry && (
            <div>
              <h4 className="text-sm font-medium text-[#6b7280] mb-1">
                Industry
              </h4>
              <p className="text-sm text-[#2c3135]">{notification.industry}</p>
            </div>
          )}

          {/* Professional Background */}
          {notification.professionalBackground && (
            <div className="rounded-lg bg-[#eef4f5] p-4">
              <h4 className="text-sm font-medium text-[#6b7280] mb-1">
                Professional Background
              </h4>
              <p className="text-sm text-[#2c3135]">
                {notification.professionalBackground}
              </p>
            </div>
          )}

          {/* Event Interests */}
          {notification.eventInterests &&
            notification.eventInterests.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                  Event Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {notification.eventInterests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#eef4f5] text-[#004242]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Climate Change Topics */}
          {notification.climateChangeTopics &&
            notification.climateChangeTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                  Climate Change Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {notification.climateChangeTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#eef4f5] text-[#004242]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Proposed Topic (for podcast/interview) */}
          {notification.proposedTopic && (
            <div>
              <h4 className="text-sm font-medium text-[#6b7280] mb-1">
                Proposed Podcast Topic
              </h4>
              <p className="text-sm text-[#2c3135]">
                {notification.proposedTopic}
              </p>
            </div>
          )}

          {/* Key Interview Questions */}
          {notification.keyQuestions &&
            notification.keyQuestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                  Key Interview Questions
                </h4>
                <div className="space-y-2">
                  {notification.keyQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004242] text-white text-xs flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[#2c3135]">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Preferred Date & Time */}
          {(notification.preferredDate || notification.preferredTime) && (
            <div className="grid grid-cols-2 gap-4">
              {notification.preferredDate && (
                <div className="rounded-lg bg-[#eef4f5] p-3">
                  <h4 className="text-xs font-medium text-[#6b7280] mb-0.5">
                    Preferred Date
                  </h4>
                  <p className="text-sm font-medium text-[#2c3135]">
                    {new Date(notification.preferredDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
              {notification.preferredTime && (
                <div className="rounded-lg bg-[#eef4f5] p-3">
                  <h4 className="text-xs font-medium text-[#6b7280] mb-0.5">
                    Preferred Time
                  </h4>
                  <p className="text-sm font-medium text-[#2c3135]">
                    {notification.preferredTime}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {notification.status === "pending" && (
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-lg"
              >
                Reject
              </Button>
              <Button className="bg-[#004242] hover:bg-[#003535] text-white rounded-lg">
                Accept Request
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
