// ============ SHARED ============
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CloudinaryFile {
  url: string;
  public_id: string;
  _id?: string;
}

// ============ JOB ============
export interface JobSalary {
  min: number;
  max: number;
  currency: string;
  period: string;
}

export interface Job {
  _id: string;
  userId: string;
  title: string;
  category: string;
  jobType: string;
  location: string;
  description: string;
  responsibility: string;
  requirement: string;
  skill: string;
  companyName: string;
  companyURL: string;
  applyUrl?: string;
  companyLogo: CloudinaryFile;
  media: {
    images: CloudinaryFile[];
    videos: CloudinaryFile[];
  };
  deathLine: string;
  postedDate: string;
  hiredCount: number;
  totalHiredCount: number;
  status: string;
  salary: JobSalary;
  createdAt: string;
  updatedAt: string;
}

// ============ EVENT ============
export interface Event {
  _id: string;
  lumaUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ MEDIA ============
export type MediaType = "url" | "audio" | "files" | string;

export interface Media {
  _id: string;
  title: string;
  mediaType: MediaType;
  category: string;
  contentUrl?: string;
  mediaFile?: CloudinaryFile;
  description: string;
  thumbnailImage?: CloudinaryFile;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ BLOG ============
export interface BlogAuthor {
  name: string;
  description: string;
  profileImage?: CloudinaryFile;
}

export interface Blog {
  _id: string;
  title: string;
  category: string;
  content: string;
  author: BlogAuthor;
  thumbnailImage: CloudinaryFile;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
