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
import { useCreateEvent } from "../hooks/useEvents";
import { Event } from "../types/content.types";

interface EventPostModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Event | null;
}

interface FormState {
  lumaUrl: string;
}

const initialState: FormState = {
  lumaUrl: "",
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

export default function EventPostModal({
  open,
  onClose,
  editData,
}: EventPostModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateEvent();

  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { lumaUrl } = formState;

  useEffect(() => {
    if (open) {
      if (editData) {
        dispatch({
          type: "SET_FORM",
          payload: {
            lumaUrl: editData.lumaUrl || "",
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

    try {
      // Events only support create (no update endpoint for full data)
      await createMutation.mutateAsync({ lumaUrl });
      toast.success("Event created successfully");
      onClose();
    } catch {
      toast.error("Failed to create event");
    }
  };

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#2c3135]">
            {isEdit ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Luma Event URL</Label>
            <Input
              value={lumaUrl}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  payload: { lumaUrl: e.target.value },
                })
              }
              placeholder="e.g. https://luma.com/ga5qbkun"
              required
            />
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
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
