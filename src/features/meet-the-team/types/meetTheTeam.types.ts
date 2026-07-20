export type SocialLink = {
  platform?: string;
  url?: string;
  _id?: string;
};

export type TeamProfilePicture = {
  url?: string;
  public_id?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  designation: string;
  description?: string;
  profilePicture?: TeamProfilePicture;
  socialLinks?: SocialLink[];
  createdAt?: string;
  updatedAt?: string;
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TeamListResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: TeamMember[];
  meta: Meta;
};
