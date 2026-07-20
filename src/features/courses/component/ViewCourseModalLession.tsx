import { X } from "lucide-react";

interface ViewCourseModalLessonProps {
  videoUrl: string;
  onClose: () => void;
}

const ViewCourseModalLesson = ({
  videoUrl,
  onClose,
}: ViewCourseModalLessonProps) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#001014]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl rounded-[16px] bg-black shadow-2xl z-10 overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 🎥 VIDEO PLAYER */}
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-auto max-h-[85vh] object-contain"
        />
      </div>
    </div>
  );
};

export default ViewCourseModalLesson;
