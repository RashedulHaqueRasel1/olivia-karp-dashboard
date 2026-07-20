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
import { useCreateJob, useUpdateJob } from "../hooks/useJobs";
import { Job } from "../types/content.types";
import RichTextEditor from "./RichTextEditor";

interface JobPostModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Job | null;
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
  applyUrl: string;
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
  applyUrl: "",
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

export default function JobPostModal({
  open,
  onClose,
  editData,
}: JobPostModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const {
    title,
    category,
    jobType,
    location,
    description,
    responsibility,
    requirement,
    skill,
    companyName,
    companyURL,
    applyUrl,
    deathLine,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    hiredCount,
    companyLogo,
    images,
    videos,
  } = formState;

  useEffect(() => {
    if (open) {
      if (editData) {
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
            applyUrl: editData.applyUrl || "",
            deathLine: editData.deathLine
              ? new Date(editData.deathLine).toISOString().split("T")[0]
              : "",
            salaryMin: editData.salary?.min?.toString() || "",
            salaryMax: editData.salary?.max?.toString() || "",
            salaryCurrency: editData.salary?.currency || "BDT",
            salaryPeriod: editData.salary?.period || "month",
            hiredCount: editData.hiredCount?.toString() || "",
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
    formData.append("category", category);
    formData.append("jobType", jobType);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("responsibility", responsibility);
    formData.append("requirement", requirement);
    formData.append("skill", skill);
    formData.append("companyName", companyName);
    formData.append("companyURL", companyURL);
    formData.append("applyUrl", applyUrl);
    formData.append("deathLine", deathLine);
    formData.append("salary[min]", salaryMin);
    formData.append("salary[max]", salaryMax);
    formData.append("salary[currency]", salaryCurrency);
    formData.append("salary[period]", salaryPeriod);
    formData.append("hiredCount", hiredCount);

    if (companyLogo) formData.append("companyLogo", companyLogo);
    if (images) {
      Array.from(images).forEach((file) => formData.append("images", file));
    }
    if (videos) formData.append("videos", videos);

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          jobId: editData._id,
          data: formData,
        });
        toast.success("Job updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Job created successfully");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update job" : "Failed to create job");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2c3135]">
            {isEdit ? "Edit Job Post" : "Create Job Post"}
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
                placeholder="e.g. Frontend Developer"
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
                <option value="Jobs">Jobs</option>
                <option value="Fellowships">Fellowships</option>
                <option value="Events">Events</option>
                <option value="Resources">Resources</option>
                <option value="Courses">Courses</option>
                <option value="Grants & Fundraising">
                  Grants & Fundraising
                </option>
                {category &&
                  ![
                    "Jobs",
                    "Fellowships",
                    "Events",
                    "Resources",
                    "Courses",
                    "Grants & Fundraising",
                  ].includes(category) && (
                    <option value={category}>{category}</option>
                  )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Job Type</Label>
              <select
                value={jobType}
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
                value={location}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { location: e.target.value },
                  })
                }
                placeholder="e.g. Dhaka, Bangladesh"
                required
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
              placeholder="Job description..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Responsibility</Label>
            <RichTextEditor
              content={responsibility}
              onChange={(html) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { responsibility: html },
                })
              }
              placeholder="Job responsibilities..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Requirement</Label>
            <RichTextEditor
              content={requirement}
              onChange={(html) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { requirement: html },
                })
              }
              placeholder="Job requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Skills</Label>
              <Input
                value={skill}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { skill: e.target.value },
                  })
                }
                placeholder="e.g. React, TypeScript, Redux"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hired Count</Label>
              <Input
                type="number"
                value={hiredCount}
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
                value={companyName}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { companyName: e.target.value },
                  })
                }
                placeholder="e.g. Tech Solutions Ltd"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company URL</Label>
              <Input
                value={companyURL}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { companyURL: e.target.value },
                  })
                }
                placeholder="e.g. https://tech.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={deathLine}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { deathLine: e.target.value },
                  })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Apply URL</Label>
              <Input
                value={applyUrl}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { applyUrl: e.target.value },
                  })
                }
                placeholder="e.g. https://careers.tech.com/apply"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Min Salary</Label>
              <Input
                type="number"
                value={salaryMin}
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
                value={salaryMax}
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
                value={salaryCurrency}
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
                value={salaryPeriod}
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
              className="bg-[#004f52] hover:bg-[#003d40] text-white rounded-lg"
            >
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Job"
                  : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
