"use client";

import { useEffect, useReducer } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateBlog, useUpdateBlog } from "../hooks/useBlogs";
import { Blog } from "../types/content.types";
import RichTextEditor from "./RichTextEditor";

interface BlogPostModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Blog | null;
}

interface FormState {
  title: string;
  category: string;
  content: string;
  authorName: string;
  authorDescription: string;
  isPublished: boolean;
  thumbnailImage: File | null;
  profileImage: File | null;
}

const initialState: FormState = {
  title: "",
  category: "",
  content: "",
  authorName: "",
  authorDescription: "",
  isPublished: true,
  thumbnailImage: null,
  profileImage: null,
};

const BLOG_CATEGORIES = [
  "Expert Insights",
  "Climate Careers",
  "Research",
  "Toolkit",
  "Community",
] as const;

type FormAction = {
  type: "SET_FORM" | "UPDATE_FIELD";
  payload: Partial<FormState>;
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FORM":
      return { ...state, ...action.payload };
    case "UPDATE_FIELD":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function BlogPostModal({
  open,
  onClose,
  editData,
}: BlogPostModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const {
    title,
    category,
    content,
    authorName,
    authorDescription,
    isPublished,
    thumbnailImage,
    profileImage,
  } = formState;

  useEffect(() => {
    if (open) {
      if (editData) {
        dispatch({
          type: "SET_FORM",
          payload: {
            title: editData.title || "",
            category: editData.category || "",
            content: editData.content || "",
            authorName: editData.author?.name || "",
            authorDescription: editData.author?.description || "",
            isPublished: editData.isPublished ?? true,
          },
        });
      } else {
        dispatch({
          type: "SET_FORM",
          payload: initialState,
        });
      }
    } else {
      dispatch({
        type: "SET_FORM",
        payload: initialState,
      });
    }
  }, [open, editData?._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    const jsonData = JSON.stringify({
      title,
      category,
      content,
      author: {
        name: authorName,
        description: authorDescription,
      },
      isPublished,
    });
    formData.append("data", jsonData);

    if (thumbnailImage) formData.append("thumbnailImage", thumbnailImage);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          blogId: editData._id,
          data: formData,
        });
        toast.success("Blog updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Blog created successfully");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update blog" : "Failed to create blog");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2c3135]">
            {isEdit ? "Edit Blog Post" : "Create Blog Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { title: e.target.value },
                  })
                }
                placeholder="e.g. The Future of Solar"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { category: e.target.value },
                  })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {BLOG_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                {category &&
                  !BLOG_CATEGORIES.includes(
                    category as (typeof BLOG_CATEGORIES)[number],
                  ) && <option value={category}>{category}</option>}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Content</Label>
            <RichTextEditor
              content={content}
              onChange={(html) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { content: html },
                })
              }
              placeholder="Write your blog content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Author Name</Label>
              <Input
                value={authorName}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { authorName: e.target.value },
                  })
                }
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author Description</Label>
              <Input
                value={authorDescription}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { authorDescription: e.target.value },
                  })
                }
                placeholder="e.g. Climate Expert"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Thumbnail Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { thumbnailImage: e.target.files?.[0] || null },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { profileImage: e.target.files?.[0] || null },
                  })
                }
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { isPublished: e.target.checked },
                })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">Published</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#004f52] hover:bg-[#003d40] text-white rounded-lg"
            >
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Blog"
                  : "Create Blog"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
