"use client";

import { ChevronLeft, ChevronRight, Star, Trash2, User } from "lucide-react";
import { useState } from "react";
import {
  useDeleteReview,
  useReviews,
  useToggleReviewApproval,
} from "../hooks/useReviews";
import { Review, Meta } from "../types/reviews.types";
import { toast } from "sonner";

export default function Reviews() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: response, isLoading, isError } = useReviews({ page, limit });
  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: toggleApproval, isPending: isToggling } =
    useToggleReviewApproval();

  const reviews: Review[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

  const handleDelete = (id: string) => {
    deleteReview(id, {
      onSuccess: () => {
        toast.success("Review deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete review");
      },
    });
  };

  const handleToggleApproval = (review: Review) => {
    toggleApproval(
      { reviewId: review._id, isApproved: !review.isApproved },
      {
        onSuccess: () => {
          toast.success(
            review.isApproved
              ? "Review marked as pending"
              : "Review approved successfully",
          );
        },
        onError: () => {
          toast.error("Failed to update review status");
        },
      },
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-[#ffb400] text-[#ffb400]"
                : "text-[#d8dfdf]"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#004f52] border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#d9534f]">Failed to load reviews data.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#2c3135] md:text-[22px]">
              Reviews & Feedback
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>›</span>
              <span>Reviews</span>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[8px] border border-[#d8dfdf] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse">
              <thead>
                <tr className="border-b border-[#d8dfdf] bg-white">
                  <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                    User
                  </th>
                  <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                    Review
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Rating
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Date
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((review, index) => (
                  <tr
                    key={review._id}
                    className={`border-b border-[#d8dfdf] transition hover:bg-[#f8fbfb] ${
                      index === reviews.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3f4] text-[#004f52]">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#2c3135]">
                            {review.user?.firstName} {review.user?.lastName}
                          </div>
                          <div className="text-[12px] text-[#7b848a]">
                            {review.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="max-w-[400px] text-[14px] leading-relaxed text-[#5f686d]">
                        {review.comment}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        {renderStars(review.rating)}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleApproval(review)}
                        disabled={isToggling}
                        title={
                          review.isApproved
                            ? "Click to set Pending"
                            : "Click to Approve"
                        }
                        className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          review.isApproved ? "bg-[#004f52]" : "bg-[#d8dfdf]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            review.isApproved
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <p
                        className={`mt-1 text-[11px] font-semibold ${
                          review.isApproved
                            ? "text-[#0d6b42]"
                            : "text-[#d58a53]"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center text-[13px] text-[#7b848a]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#d9534f] transition hover:bg-[#fff5f5] cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {reviews.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-[#7a99b8]"
                    >
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {reviews.length > 0 && (
            <div className="flex flex-col gap-4 bg-[#eef3f4] px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <p className="text-[14px] text-[#5f686d]">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, meta.total)} of {meta.total} results
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] bg-[#004f52] px-3 font-medium text-white shadow-sm">
                  {page}
                </button>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (meta.totalPage || 1)}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
