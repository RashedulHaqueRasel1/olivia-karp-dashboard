// src/features/courses/types/courses.types.ts

export type Lesson = {
  _id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  level: string;
  videoUrl: string;
};

export type Course = {
  _id: string;
  title: string;
  lessonsCount: number;
  totalDuration: string;
  lessons: Lesson[];
  isLocked: boolean;
  totalEnrolled: number;
  lessonCount: number;
  isAvailable: boolean;
  currency: string;
  image: {
    url?: string;
    public_id?: string;
  };
  instructorName?: string;
  instructorBio?: string;
  instructorImage?: {
    url?: string;
    public_id?: string;
  };
  price: number;
  courseBoxUrl?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};
