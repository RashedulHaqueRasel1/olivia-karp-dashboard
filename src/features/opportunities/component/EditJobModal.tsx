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
import { useUpdateOpportunityJob } from "../hooks/useOpportunities";
import type { Job } from "../types/opportunity.types";

interface EditJobModalProps {
  open: boolean;
  onClose: () => void;
  editData: Job | null;
}

interface FormState {
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
  deathLine: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: string;
  hiredCount: string;
  companyLogo: File | null;
  images: FileList | null;
  videos: File | null;
}

const initialState: FormState = {
  title: "",
  category: "",
  jobType: "full-time",
  location: "",
  description: "",
  responsibility: "",
  requirement: "",
  skill: "",
  companyName: "",
  companyURL: "",
  deathLine: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "BDT",
  salaryPeriod: "month",
  hiredCount: "",
  companyLogo: null,
  images: null,
  videos: null,
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

export default function EditJobModal({
  open,
  onClose,
  editData,
}: EditJobModalProps) {
  const updateMutation = useUpdateOpportunityJob();
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    if (open && editData) {
      dispatch({
        type: "SET_FORM",
        payload: {
          title: editData.title || "",
          category: editData.category || "",
          jobType: editData.jobType || "full-time",
          location: editData.location || "",
          description: editData.description || "",
          responsibility: editData.responsibility || "",
          requirement: editData.requirement || "",
          skill: editData.skill || "",
          companyName: editData.companyName || "",
          companyURL: editData.companyURL || "",
          deathLine: editData.deathLine
            ? new Date(editData.deathLine).toISOString().split("T")[0]
            : "",
          salaryMin: editData.salary?.min?.toString() || "",
          salaryMax: editData.salary?.max?.toString() || "",
          salaryCurrency: editData.salary?.currency || "BDT",
          salaryPeriod: editData.salary?.period || "month",
          hiredCount: editData.hiredCount?.toString() || "",
          companyLogo: null,
          images: null,
          videos: null,
        },
      });
    } else if (!open) {
      dispatch({ type: "SET_FORM", payload: initialState });
    }
  }, [open, editData?._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("category", formState.category);
    formData.append("jobType", formState.jobType);
    formData.append("location", formState.location);
    formData.append("description", formState.description);
    formData.append("responsibility", formState.responsibility);
    formData.append("requirement", formState.requirement);
    formData.append("skill", formState.skill);
    formData.append("companyName", formState.companyName);
    formData.append("companyURL", formState.companyURL);
    formData.append("deathLine", formState.deathLine);
    formData.append("salary[min]", formState.salaryMin);
    formData.append("salary[max]", formState.salaryMax);
    formData.append("salary[currency]", formState.salaryCurrency);
    formData.append("salary[period]", formState.salaryPeriod);
    formData.append("hiredCount", formState.hiredCount);

    if (formState.companyLogo)
      formData.append("companyLogo", formState.companyLogo);
    if (formState.images) {
      Array.from(formState.images).forEach((file) =>
        formData.append("images", file),
      );
    }
    if (formState.videos) formData.append("videos", formState.videos);

    try {
      await updateMutation.mutateAsync({
        jobId: editData._id,
        data: formData,
      });
      toast.success("Job updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update job");
    }
  };

  const isLoading = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2c3135]">Edit Job Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={formState.title}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { title: e.target.value },
                  })
                }
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                value={formState.category}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { category: e.target.value },
                  })
                }
                placeholder="e.g. Software Development"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Job Type</Label>
              <select
                value={formState.jobType}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { jobType: e.target.value },
                  })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={formState.location}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { location: e.target.value },
                  })
                }
                placeholder="e.g. London, UK"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              value={formState.description}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { description: e.target.value },
                })
              }
              placeholder="Job description..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Responsibility</Label>
              <textarea
                value={formState.responsibility}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { responsibility: e.target.value },
                  })
                }
                placeholder="Job responsibilities..."
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Requirement</Label>
              <textarea
                value={formState.requirement}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { requirement: e.target.value },
                  })
                }
                placeholder="Job requirements..."
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Skills</Label>
              <Input
                value={formState.skill}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { skill: e.target.value },
                  })
                }
                placeholder="e.g. React, TypeScript"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hired Count</Label>
              <Input
                type="number"
                value={formState.hiredCount}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { hiredCount: e.target.value },
                  })
                }
                placeholder="e.g. 5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input
                value={formState.companyName}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { companyName: e.target.value },
                  })
                }
                placeholder="e.g. GreenTech Solutions"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company URL</Label>
              <Input
                value={formState.companyURL}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { companyURL: e.target.value },
                  })
                }
                placeholder="e.g. https://greentech.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={formState.deathLine}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { deathLine: e.target.value },
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Min Salary</Label>
              <Input
                type="number"
                value={formState.salaryMin}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { salaryMin: e.target.value },
                  })
                }
                placeholder="50000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Salary</Label>
              <Input
                type="number"
                value={formState.salaryMax}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { salaryMax: e.target.value },
                  })
                }
                placeholder="150000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input
                value={formState.salaryCurrency}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { salaryCurrency: e.target.value },
                  })
                }
                placeholder="BDT"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Period</Label>
              <select
                value={formState.salaryPeriod}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { salaryPeriod: e.target.value },
                  })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="hour">Hour</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Company Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { companyLogo: e.target.files?.[0] || null },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { images: e.target.files },
                  })
                }
              />
            </div>
            {/* <div className="space-y-1.5">
              <Label>Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { videos: e.target.files?.[0] || null },
                  })
                }
              />
            </div> */}
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
              className="bg-[#004242] hover:bg-[#003535] text-white rounded-lg"
            >
              {isLoading ? "Updating..." : "Update Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
