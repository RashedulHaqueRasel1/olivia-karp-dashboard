"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
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
import { useCreateMedia, useUpdateMedia } from "../hooks/useMedia";
import { Media } from "../types/content.types";
import RichTextEditor from "./RichTextEditor";

interface MediaPostModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Media | null;
}

interface FormState {
  title: string;
  mediaType: string;
  category: string;
  contentUrl: string;
  description: string;
  isPublished: boolean;
  isFeatured: boolean;
  mediaFile: File | null;
  thumbnailImage: File | null;
  thumbnailPreview: string | null;
}

const initialState: FormState = {
  title: "",
  mediaType: "url",
  category: "",
  contentUrl: "",
  description: "",
  isPublished: true,
  isFeatured: false,
  mediaFile: null,
  thumbnailImage: null,
  thumbnailPreview: null,
};

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

export default function MediaPostModal({
  open,
  onClose,
  editData,
}: MediaPostModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!editData;
  const createMutation = useCreateMedia();
  const updateMutation = useUpdateMedia();

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const {
    title,
    mediaType,
    category,
    contentUrl,
    description,
    isPublished,
    isFeatured,
    mediaFile,
    thumbnailImage,
    thumbnailPreview,
  } = formState;

  useEffect(() => {
    if (open) {
      if (editData) {
        dispatch({
          type: "SET_FORM",
          payload: {
            title: editData.title || "",
            mediaType: editData.mediaType || "url",
            category: editData.category || "",
            contentUrl: editData.contentUrl || "",
            description: editData.description || "",
            isPublished: editData.isPublished ?? true,
            isFeatured: editData.isFeatured ?? false,
            mediaFile: null,
            thumbnailImage: null,
            thumbnailPreview: editData.thumbnailImage?.url || null,
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
    formData.append("title", title);
    formData.append("mediaType", mediaType);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("isPublished", String(isPublished));
    formData.append("isFeatured", String(isFeatured));

    if (mediaType === "url") {
      formData.append("contentUrl", contentUrl);
    } else if (mediaFile) {
      formData.append("mediaFile", mediaFile);
    }

    if (thumbnailImage) {
      formData.append("thumbnailImage", thumbnailImage);
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          mediaId: editData._id,
          data: formData,
        });
        toast.success("Media updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Media created successfully");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update media" : "Failed to create media");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2c3135]">
            {isEdit ? "Edit Media Post" : "Create Media Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="e.g. Future of Green Energy in Canada"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Media Type</Label>
              <select
                value={mediaType}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { mediaType: e.target.value },
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="url">URL</option>
                <option value="audio">Audio</option>
                <option value="files">Files</option>
              </select>
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
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="video">Video</option>
                <option value="event-recording">Event Recording</option>
                <option value="expert-interview">Expert Interview</option>
                <option value="insight">Insight</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>

          {mediaType === "url" && (
            <div className="space-y-1.5">
              <Label>Content URL</Label>
              <Input
                value={contentUrl}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { contentUrl: e.target.value },
                  })
                }
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                required
              />
            </div>
          )}

          {(mediaType === "audio" || mediaType === "files") && (
            <div className="space-y-1.5">
              <Label>
                {mediaType === "audio" ? "Audio File" : "Document File"}
              </Label>
              <Input
                type="file"
                accept={
                  mediaType === "audio" ? "audio/*" : ".pdf,.doc,.docx,.txt"
                }
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { mediaFile: e.target.files?.[0] || null },
                  })
                }
                required={!isEdit}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:bg-gray-50/50 ${
                thumbnailPreview ? "border-[#004f52]" : "border-gray-200"
              }`}
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-full p-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({
                        type: "UPDATE_FIELD",
                        payload: {
                          thumbnailImage: null,
                          thumbnailPreview: null,
                        },
                      });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 mb-3 rounded-full bg-[#004f52]/5 text-[#004f52]">
                    <Upload className="h-8 w-8" />
                  </div>
                  <p className="mb-2 text-sm text-[#2c3135]">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { thumbnailImage: file },
                  });
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      dispatch({
                        type: "UPDATE_FIELD",
                        payload: { thumbnailPreview: reader.result as string },
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <RichTextEditor
              content={description}
              onChange={(html) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { description: html },
                })
              }
              placeholder="Describe this media content..."
            />
          </div>

          <div className="flex items-center gap-6">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { isFeatured: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>

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
                  ? "Update Media"
                  : "Create Media"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
