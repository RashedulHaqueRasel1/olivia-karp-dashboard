"use client";

import { useCallback, useState } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useBlogs, useDeleteBlog } from "../hooks/useBlogs";
import { Blog, Meta } from "../types/content.types";
import BlogPostModal from "./BlogPostModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import TableSkeleton from "./TableSkeleton";
import { toast } from "sonner";

export default function BlogPostPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);

  const { data: response, isLoading, isError } = useBlogs({ page, limit });
  const deleteMutation = useDeleteBlog();

  const blogs: Blog[] = response?.data || [];
  const meta: Meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBlog(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingBlogId) return;
    try {
      await deleteMutation.mutateAsync(deletingBlogId);
      toast.success("Blog deleted successfully");
      setDeletingBlogId(null);
    } catch {
      toast.error("Failed to delete blog");
    }
  }, [deletingBlogId, deleteMutation]);

  if (isError) {
    return (
      <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
        <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
          <div className="flex items-center justify-center py-20">
            <p className="text-[#d9534f]">
              Failed to load blogs data. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f8f8] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[10px] border border-[#d8dfdf] bg-[#fbfcfc] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#2c3135] md:text-[22px]">
              Blog Posts
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-[#7b848a]">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span>Content Management</span>
              <span>&gt;</span>
              <span>Blog Posts</span>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingBlog(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#003d40] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Blog Post
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <TableSkeleton columns={5} />
          ) : (
            <div className="overflow-hidden rounded-[8px] border border-[#d8dfdf] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#d8dfdf] bg-white">
                      <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#252b2f]">
                        Title
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Category
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Author
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Published
                      </th>
                      <th className="px-4 py-4 text-center text-[14px] font-semibold text-[#252b2f]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog, index) => (
                      <tr
                        key={blog._id}
                        className={`border-b border-[#d8dfdf] transition hover:bg-[#f8fbfb] ${index === blogs.length - 1 ? "border-b-0" : ""}`}
                      >
                        <td className="px-4 py-4">
                          <div className="max-w-[280px] truncate font-medium text-[#2c3135] text-[15px]">
                            {blog.title}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex rounded-full px-3 py-1 text-[12px] font-medium bg-[#e8f4f5] text-[#004f52]">
                            {blog.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-[14px] font-medium text-[#252b2f]">
                          {blog.author?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${
                              blog.isPublished
                                ? "bg-[#cdeed9] text-[#0d6b42]"
                                : "bg-[#fef6e0] text-[#c5a543]"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-5 text-[#004f52]">
                            <button
                              onClick={() => setViewingBlog(blog)}
                              className="transition hover:opacity-70 p-1 cursor-pointer"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingBlog(blog);
                                setIsModalOpen(true);
                              }}
                              className="transition hover:opacity-70 p-1 cursor-pointer"
                            >
                              <Pencil className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => setDeletingBlogId(blog._id)}
                              className="transition hover:opacity-70 p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {blogs.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-12 text-center text-[#7a99b8]"
                        >
                          No blog posts found. Create one to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {blogs.length > 0 && (
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
                    {meta.totalPage > 1 && page < meta.totalPage && (
                      <>
                        <span className="text-[#5b6e70] text-sm">...</span>
                        <button
                          onClick={() => setPage(meta.totalPage)}
                          className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] px-3 text-[#5b6e70] transition hover:bg-white"
                        >
                          {meta.totalPage}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPage || 1, p + 1))
                      }
                      disabled={page >= (meta.totalPage || 1)}
                      className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#7f9da0] text-[#5b6e70] disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BlogPostModal
        open={isModalOpen}
        onClose={handleCloseModal}
        editData={editingBlog}
      />

      <DeleteConfirmDialog
        open={!!deletingBlogId}
        onClose={() => setDeletingBlogId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />

      {/* View Blog Details Dialog */}
      {viewingBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setViewingBlog(null)}
        >
          <div
            className="bg-white rounded-xl max-w-[600px] w-full mx-4 max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2c3135]">
                {viewingBlog.title}
              </h2>
              <button
                onClick={() => setViewingBlog(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-[#5f686d]">Category:</span>{" "}
                <span className="text-[#2c3135]">{viewingBlog.category}</span>
              </div>
              <div>
                <span className="font-medium text-[#5f686d]">Author:</span>{" "}
                <span className="text-[#2c3135]">
                  {viewingBlog.author?.name}
                </span>
              </div>
              <div>
                <span className="font-medium text-[#5f686d]">Published:</span>{" "}
                <span className="text-[#2c3135]">
                  {viewingBlog.isPublished ? "Yes" : "No"}
                </span>
              </div>
              {viewingBlog.thumbnailImage?.url && (
                <div>
                  <span className="font-medium text-[#5f686d] block mb-1">
                    Thumbnail:
                  </span>
                  <img
                    src={viewingBlog.thumbnailImage.url}
                    alt="Thumbnail"
                    className="max-w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              <div>
                <span className="font-medium text-[#5f686d] block mb-1">
                  Content:
                </span>
                <div
                  className="text-[#2c3135] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewingBlog.content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
