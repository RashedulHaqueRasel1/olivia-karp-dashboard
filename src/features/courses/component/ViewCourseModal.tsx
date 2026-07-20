import { BookOpen, Film, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useToggleCourse } from "../hooks/useCourses";
import { Course } from "../types/courses.types";
import ViewCourseModalLesson from "./ViewCourseModalLession";
interface ViewCourseModalProps {
  course: Course;
  onClose: () => void;
}

export function ViewCourseModal({ course, onClose }: ViewCourseModalProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isOn, setIsOn] = useState(course?.isAvailable ?? false);
  const { mutateAsync: toggleCourse, isPending } = useToggleCourse();

  const handleToggle = async () => {
    try {
      await toggleCourse(course._id);
      setIsOn(!isOn);
      toast.success(`Course is now ${!isOn ? "published" : "draft"}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update course availability");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#001014]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[16px] bg-white p-6 md:p-8 shadow-2xl z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f4] text-[#5b6e70] hover:bg-[#e0e6e6]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center border-b border-[#e6ebeb] pb-8">
          {/* Image */}
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-[16px] overflow-hidden">
            {course?.image?.url ? (
              <img
                src={course.image.url}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[#004f52] text-white">
                <BookOpen />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold">{course?.title}</h2>

            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded">
                {course?.category}
              </span>

              <span
                className={`px-3 py-1 rounded ${
                  isOn
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isOn ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="flex gap-4 text-sm text-gray-500">
              <span>{course?.lessonCount} Lessons</span>
              <span>{course?.totalDuration}</span>
              <span>{course?.totalEnrolled} Enrolled</span>
            </div>

            <div className="font-semibold">
              {course?.price === 0
                ? "Free"
                : `${course?.currency} ${course?.price}`}
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Curriculum</h3>

          {Array.isArray(course?.lessons) && course.lessons.length > 0 ? (
            course.lessons.map((lesson, idx) => {
              const isLessonLocked = lesson?.isLocked ?? course?.isLocked;

              return (
                <div
                  key={lesson._id || idx}
                  className="border p-4 rounded mb-3 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">
                      {idx + 1}. {lesson?.title}
                    </h4>

                    <div className="text-sm text-gray-500">
                      {lesson?.duration || 0} mins • {lesson?.level}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveVideoUrl(lesson?.videoUrl)}
                      className={`flex items-center gap-2 px-4 py-2 rounded text-sm bg-[#004f52] cursor-pointer text-white hover:bg-[#0a7a7d]`}
                    >
                      <Film size={16} />
                      Watch
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No lessons found</p>
          )}
        </div>

        {/* Footer */}
        {/* <div className="mt-6 flex justify-end items-center gap-2">
          <span className="text-sm text-gray-600">
            {isOn ? "Available" : "Unavailable"}
          </span>

          <button
            onClick={handleToggle}
            disabled={isPending}
            className="disabled:opacity-50 transition-opacity"
          >
            {isOn ? (
              <ToggleRight className="h-8 w-8 text-green-600 cursor-pointer" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-400 cursor-pointer" />
            )}
          </button>
        </div> */}
      </div>

      {/* Video Player Modal */}
      {activeVideoUrl && (
        <ViewCourseModalLesson
          videoUrl={activeVideoUrl}
          onClose={() => setActiveVideoUrl(null)}
        />
      )}
    </div>
  );
}
