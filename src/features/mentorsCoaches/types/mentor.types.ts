export type SupportItem = {
  _id: string;
  title: string;
  description: string;
};

export type ExperienceItem = {
  _id: string;
  title: string;
  description: string;
};

export type MentorCoach = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  about?: string;
  type: "mentor" | "coach";
  designation?: string;
  skills?: string[];
  support?: SupportItem[];
  experience?: ExperienceItem[];
  languages?: string[];
  experienceYears?: number;
  linkedin?: string;
  website?: string;
  isPaidSession?: boolean;
  hourlyRate?: number;
  bookingLink?: string;
  motivation?: string;
  goal?: string;
  image?: {
    url?: string;
    public_id?: string;
  };
  isApproved: boolean;
  isActive: boolean;
  totalSessions?: number;
  createdAt?: string;
  updatedAt?: string;
  address?: string; // added because it was in user's demo data as well
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type BulkUploadResponse = {
  success: boolean;
  message: string;
  data: {
    createdCount: number;
    updatedCount: number;
    errors: string[];
  };
};
