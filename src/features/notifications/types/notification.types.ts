import { Meta } from "@/features/content-management/types/content.types";

export type { Meta };

export type NotificationType =
  | "job"
  | "blog"
  | "course-idea"
  | "speaker-engagement"
  | "interview"
  | "podcast";

export interface NotificationUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface Notification {
  _id: string;
  title: string;
  type: NotificationType;
  status: "pending" | "read" | "accepted" | "rejected";
  submittedBy: NotificationUser;
  message?: string;
  description?: string;
  specialization?: string;
  industry?: string;
  professionalBackground?: string;
  eventInterests?: string[];
  climateChangeTopics?: string[];
  requestType?: string;
  expertise?: string;
  proposedTopic?: string;
  keyQuestions?: string[];
  preferredDate?: string;
  preferredTime?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Notification[];
  meta: Meta;
}
