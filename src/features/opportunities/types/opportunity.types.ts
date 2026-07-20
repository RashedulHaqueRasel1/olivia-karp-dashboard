import { Job, Meta } from "@/features/content-management/types/content.types";

export type { Job, Meta };

export type OpportunityFilter = "all" | "open" | "closed";

export interface JobsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Job[];
  meta: Meta;
}
