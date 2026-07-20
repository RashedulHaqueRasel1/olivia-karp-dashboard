"use client";

import { useState, useReducer, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useMyProfile,
  useUpdateProfile,
  useChangePassword,
  useUpdateAiData,
} from "../hooks/useSettings";
import type { UserProfile } from "../types/settings.types";

type Tab = "personal" | "password";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

type ProfileFormAction =
  | { type: "SET_FIELD"; field: keyof ProfileFormState; value: string }
  | { type: "RESET"; payload: ProfileFormState };

function profileReducer(
  state: ProfileFormState,
  action: ProfileFormAction,
): ProfileFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

const initialProfileState: ProfileFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [profileForm, dispatch] = useReducer(
    profileReducer,
    initialProfileState,
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const updateAiDataMutation = useUpdateAiData();

  const user: UserProfile | undefined = data?.data;

  useEffect(() => {
    if (user) {
      dispatch({
        type: "RESET",
        payload: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
        },
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    const formData = new FormData();
    formData.append("firstName", profileForm.firstName);
    formData.append("lastName", profileForm.lastName);
    if (profileForm.phone) formData.append("phone", profileForm.phone);
    if (profileForm.bio) formData.append("bio", profileForm.bio);
    if (imageFile) formData.append("image", imageFile);

    try {
      await updateProfileMutation.mutateAsync(formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setImageFile(null);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Failed to change password");
    }
  };

  const handleUpdateAiData = async () => {
    try {
      const response = await updateAiDataMutation.mutateAsync();
      toast.success(response?.message || "AI data updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update AI data",
      );
    }
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "";

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-5">
          <div className="flex-1 h-[52px] bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1 h-[52px] bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="bg-white border border-[#e4e4e4] rounded-xl p-5 flex items-center gap-8">
          <div className="h-[120px] w-[120px] rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-3">
            <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white border border-[#e4e4e4] rounded-xl p-5 space-y-8">
          <div className="flex justify-between">
            <div className="h-7 w-56 bg-gray-200 rounded animate-pulse" />
            <div className="h-[52px] w-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-[30px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-[146px] w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#181919]">Settings</h1>
        <p className="text-base text-[#727272]">Dashboard &gt; Settings</p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleUpdateAiData}
          disabled={updateAiDataMutation.isPending}
          className="bg-[#004242] hover:bg-[#003535] text-[#f8fbfb] h-[52px] px-6 rounded-lg text-base font-black"
        >
          {updateAiDataMutation.isPending ? "Updating..." : "Update AI Data"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-5">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex-1 h-[52px] rounded-lg text-base font-black transition-colors ${
            activeTab === "personal"
              ? "bg-[#004242] text-[#f8fbfb]"
              : "bg-[#004242]/10 text-[#004242]"
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 h-[52px] rounded-lg text-base font-black transition-colors ${
            activeTab === "password"
              ? "bg-[#004242] text-[#f8fbfb]"
              : "bg-[#004242]/10 text-[#004242]"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-[#e4e4e4] rounded-xl p-5 flex items-center gap-8">
        <div className="relative">
          <Avatar className="h-[120px] w-[120px]">
            <AvatarImage
              src={
                imageFile ? URL.createObjectURL(imageFile) : user?.image?.url
              }
            />
            <AvatarFallback className="bg-[#eef4f5] text-[#004242] text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#004242] rounded-full flex items-center justify-center cursor-pointer text-white text-xs">
              +
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-[#181919]">
            {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—"}
          </p>
          <p className="text-lg text-[#181919]">
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : ""}
          </p>
        </div>
      </div>

      {/* Personal Information Tab */}
      {activeTab === "personal" && (
        <div className="bg-white border border-[#e4e4e4] rounded-xl p-5 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#181919]">
              Personal Information
            </h2>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#004242] hover:bg-[#003535] text-[#f8fbfb] h-[52px] px-6 rounded-lg text-base font-black"
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setImageFile(null);
                    if (user) {
                      dispatch({
                        type: "RESET",
                        payload: {
                          firstName: user.firstName || "",
                          lastName: user.lastName || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          bio: user.bio || "",
                        },
                      });
                    }
                  }}
                  className="h-[52px] px-6 rounded-lg text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProfileSave}
                  disabled={updateProfileMutation.isPending}
                  className="bg-[#004242] hover:bg-[#003535] text-[#f8fbfb] h-[52px] px-6 rounded-lg text-base font-black"
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* First / Last Name */}
            <div className="grid grid-cols-2 gap-[30px]">
              <div className="space-y-2">
                <label className="text-lg font-medium text-[#181919]">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "firstName",
                        value: e.target.value,
                      })
                    }
                    className="w-full border border-[#e4e4e4] rounded-lg p-4 text-lg text-[#3b3b3b] outline-none focus:border-[#004242]"
                  />
                ) : (
                  <div className="border border-[#e4e4e4] rounded-lg p-4">
                    <p className="text-lg text-[#3b3b3b]">
                      {user?.firstName || "—"}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg font-medium text-[#181919]">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "lastName",
                        value: e.target.value,
                      })
                    }
                    className="w-full border border-[#e4e4e4] rounded-lg p-4 text-lg text-[#3b3b3b] outline-none focus:border-[#004242]"
                  />
                ) : (
                  <div className="border border-[#e4e4e4] rounded-lg p-4">
                    <p className="text-lg text-[#3b3b3b]">
                      {user?.lastName || "—"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-2 gap-[30px]">
              <div className="space-y-2">
                <label className="text-lg font-medium text-[#181919]">
                  Email Address
                </label>
                <div className="border border-[#e4e4e4] rounded-lg p-4">
                  <p className="text-lg text-[#3b3b3b]">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-lg font-medium text-[#181919]">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "phone",
                        value: e.target.value,
                      })
                    }
                    className="w-full border border-[#e4e4e4] rounded-lg p-4 text-lg text-[#3b3b3b] outline-none focus:border-[#004242]"
                  />
                ) : (
                  <div className="border border-[#e4e4e4] rounded-lg p-4">
                    <p className="text-lg text-[#3b3b3b]">
                      {user?.phone || "—"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#181919]">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileForm.bio}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "bio",
                      value: e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full border border-[#e4e4e4] rounded-lg p-4 text-lg text-[#3b3b3b] outline-none focus:border-[#004242] resize-none"
                />
              ) : (
                <div className="border border-[#e4e4e4] rounded-lg p-4 min-h-[146px]">
                  <p className="text-lg text-[#3b3b3b]">{user?.bio || "—"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="bg-white border border-[#e4e4e4] rounded-xl p-5 space-y-8">
          <h2 className="text-2xl font-semibold text-[#181919]">
            Change password
          </h2>

          <div className="grid grid-cols-3 gap-[30px]">
            <div className="space-y-2">
              <label className="text-base font-medium text-[#181919]">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                className="w-full border border-[#263451] rounded-lg p-4 text-base text-[#1e1e1e] outline-none focus:border-[#004242]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium text-[#181919]">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="w-full border border-[#263451] rounded-lg p-4 text-base text-[#1e1e1e] outline-none focus:border-[#004242]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium text-[#181919]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm new password"
                className="w-full border border-[#263451] rounded-lg p-4 text-base text-[#1e1e1e] outline-none focus:border-[#004242]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handlePasswordSave}
              disabled={changePasswordMutation.isPending}
              className="bg-[#004242] hover:bg-[#003535] text-[#f8fbfb] h-[52px] px-6 rounded-lg text-base font-black"
            >
              {changePasswordMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
