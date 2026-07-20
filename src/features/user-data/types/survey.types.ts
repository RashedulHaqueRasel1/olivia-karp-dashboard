import { Meta } from "@/features/content-management/types/content.types";

export type { Meta };

export interface SurveyUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Survey {
  _id: string;
  userId: SurveyUser;
  name: string;
  email: string;
  city: string;
  country: string;
  link: string;
  climateJourney: string;
  message: string;
  interest: string[];
  goals: string[];
  successMessage: string;
  whatLooking: string[];
  engagementPreference: string;
  opportunity: string;
  hubs: string;
  region: string;
  impactNewsletter: boolean;
  localNotification: boolean;
  updateFrequency: string;
  tellAbout: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveysResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Survey[];
  meta: Meta;
}

export interface SingleSurveyResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Survey;
}
