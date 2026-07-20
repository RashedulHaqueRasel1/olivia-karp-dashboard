"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useCourses, useDeleteCourse } from "../hooks/useCourses";
import { Course, Meta } from "../types/courses.types";
import { AddCourseModal } from "./AddCourseModal";
import { ViewCourseModal } from "./ViewCourseModal";
import { EditCourseModal } from "./EditCourseModal";

export default function Courses() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  // We are ignoring type/isApproved for now as they weren't in the demo
  const { data: response, isLoading, isError } = useCourses({ page, limit });
  const { mutate: deleteCourseMutation } = useDeleteCourse();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourseMutation(id);
    }
  };

  const courses: Course[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f8]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#004f52] border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f8]">
        <p className="text-[#d9534f]">Failed to load courses data.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#2c3135] md:text-[22px]">
              Courses & Learning Content
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>›</span>
              <span>Courses</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#003d40] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Courses
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[8px] border border-[#d8dfdf] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse">
              <thead>
                <tr className="border-b border-[#d8dfdf] bg-white">
                  <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                    Course Title
                  </th>
                  <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                    Instructor
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Enrolled
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course._id}
                    className={`border-b border-[#d8dfdf] transition hover:bg-[#f8fbfb] ${index === courses.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-4 py-4 text-[15px] text-[#7a7a7a]">
                      <div className="max-w-[220px] truncate font-medium text-[#2c3135]">
                        {course.title}
                      </div>
                      <span className="text-[12px] text-[#7a99b8] block mt-0.5">
                        {course.lessonsCount} lessons • {course.totalDuration}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-[13px] font-medium text-[#252b2f]">
                      {course.category}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="text-[15px] leading-5 text-[#252b2f]">
                        {course.totalEnrolled}
                      </div>
                      <div className="text-[13px] leading-5 text-[#7a99b8]">
                        students
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${course.isAvailable ? "bg-[#fff2e8] text-[#d58a53]" : "bg-[#cdeed9] text-[#0d6b42]"}`}
                      >
                        {course.isAvailable ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-5 text-[#004f52]">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="transition hover:opacity-70 p-1 cursor-pointer"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => setCourseToEdit(course)}
                          className="transition hover:opacity-70 p-1 cursor-pointer"
                        >
                          <Pencil className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="transition hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {courses.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-[#7a99b8]"
                    >
                      No courses found. Create one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {courses.length > 0 && (
            <div className="flex flex-col gap-4 bg-[#eef3f4] px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <p className="text-[14px] text-[#5f686d]">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, meta.total)} of {meta.total} results
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] bg-[#004f52] px-3 font-medium text-white shadow-sm">
                  {page}
                </button>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (meta.totalPage || 1)}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddCourseModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {selectedCourse && (
        <ViewCourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {courseToEdit && (
        <EditCourseModal
          course={courseToEdit}
          onClose={() => setCourseToEdit(null)}
        />
      )}
    </section>
  );
}
