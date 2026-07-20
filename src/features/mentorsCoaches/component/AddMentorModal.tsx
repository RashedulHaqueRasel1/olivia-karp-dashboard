import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { X, Plus, Trash2, UploadCloud, Info } from "lucide-react";
import { useJoinMentorCoach } from "../hooks/useMentorsCoaches";

interface AddMentorModalProps {
  onClose: () => void;
}

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  about: string;
  type: "mentor" | "coach";
  experienceYears: number;
  availability: string;
  linkedin: string;
  website: string;
  languages: { value: string }[];
  skills: { value: string }[];
  support: { title: string; description: string }[];
  experience: { title: string; description: string }[];
  isPaidSession: boolean;
  hourlyRate: number;
  bookingLink: string;
  motivation: string;
  goal: string;
};

export function AddMentorModal({ onClose }: AddMentorModalProps) {
  const { mutate: joinSubmit, isPending } = useJoinMentorCoach();
  const [file, setFile] = useState<File | null>(null);

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      type: "mentor",
      isPaidSession: true,
      languages: [{ value: "" }],
      skills: [{ value: "" }],
      support: [{ title: "", description: "" }],
      experience: [{ title: "", description: "" }],
    },
  });

  const isPaidSession = useWatch({ control, name: "isPaidSession" });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: "languages" });
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: "skills" });
  const {
    fields: supportFields,
    append: appendSupport,
    remove: removeSupport,
  } = useFieldArray({ control, name: "support" });
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: "experience" });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();

    // Append standard text fields safely
    const standardFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "bio",
      "about",
      "type",
      "experienceYears",
      "availability",
      "linkedin",
      "website",
      "bookingLink",
      "motivation",
      "goal",
    ];

    standardFields.forEach((key) => {
      const val = data[key as keyof FormValues];
      if (val) formData.append(key, String(val));
    });

    formData.append("isPaidSession", data.isPaidSession ? "true" : "false");

    if (data.isPaidSession && data.hourlyRate) {
      formData.append("hourlyRate", String(data.hourlyRate));
    }

    data.languages.forEach((item, idx) => {
      if (item.value.trim())
        formData.append(`languages[${idx}]`, item.value.trim());
    });

    data.skills.forEach((item, idx) => {
      if (item.value.trim())
        formData.append(`skills[${idx}]`, item.value.trim());
    });

    data.support.forEach((item, idx) => {
      if (item.title.trim())
        formData.append(`support[${idx}][title]`, item.title.trim());
      if (item.description.trim())
        formData.append(
          `support[${idx}][description]`,
          item.description.trim(),
        );
    });

    data.experience.forEach((item, idx) => {
      if (item.title.trim())
        formData.append(`experience[${idx}][title]`, item.title.trim());
      if (item.description.trim())
        formData.append(
          `experience[${idx}][description]`,
          item.description.trim(),
        );
    });

    if (file) {
      formData.append("file", file);
    }

    joinSubmit(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#001014]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f4] text-[#5b6e70] transition hover:bg-[#e0e6e6] z-20"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-8 border-b border-[#e6ebeb] pb-6">
          <h2 className="text-2xl font-bold text-[#1a2326]">
            Join as Mentor/Coach
          </h2>
          <p className="mt-2 text-sm text-[#7a99b8]">
            Fill out your details to join our platform. Information provided
            here will be reviewed manually before your account is approved.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1a2326] mb-4">
                Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    First Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    {...register("firstName", { required: true })}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="John"
                  />
                </label>
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Last Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    {...register("lastName", { required: true })}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="Doe"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Email <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="john@example.com"
                  />
                </label>
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Phone
                  </span>
                  <input
                    {...register("phone")}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="+1 234 567 8900"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Profile Type <span className="text-red-500">*</span>
                  </span>
                  <select
                    {...register("type", { required: true })}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52] bg-white"
                  >
                    <option value="mentor">Mentor</option>
                    <option value="coach">Coach</option>
                  </select>
                </label>
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Years of Exp. <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    {...register("experienceYears", { required: true })}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="8"
                  />
                </label>
              </div>

              <label className="block mt-4">
                <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                  Profile Image
                </span>
                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-[#8db3b5] px-6 py-8 hover:bg-[#f8fbfb] transition cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-10 w-10 text-[#004f52]" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      {file ? (
                        <span className="font-semibold text-[#004f52]">
                          {file.name} Selected
                        </span>
                      ) : (
                        <>
                          <span className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[#004f52] focus-within:outline-none hover:text-[#003d40]">
                            Upload a file
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1a2326] mb-4">
                Summary
              </h3>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                  Short Bio (Designation){" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  {...register("bio", { required: true })}
                  className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="Senior Software Engineer & Mentor"
                />
              </label>

              <label className="block mt-4">
                <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                  Full About Me
                </span>
                <textarea
                  {...register("about")}
                  rows={4}
                  className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52] resize-none"
                  placeholder="I help developers improve their backend and system design skills..."
                ></textarea>
              </label>

              <label className="block mt-4">
                <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                  General Availability
                </span>
                <input
                  {...register("availability")}
                  className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                  placeholder="Monday-Friday (6PM-9PM)"
                />
              </label>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    LinkedIn
                  </span>
                  <input
                    {...register("linkedin")}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="https://linkedin.com/..."
                  />
                </label>
                <label className="block col-span-1">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Website
                  </span>
                  <input
                    {...register("website")}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="https://..."
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e6ebeb] pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#1a2326]">
                    Skills
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendSkill({ value: "" })}
                    className="text-[12px] font-semibold text-[#004f52] hover:text-[#003d40] flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Skill
                  </button>
                </div>
                <div className="space-y-3">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`skills.${index}.value` as const, {
                          required: true,
                        })}
                        className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                        placeholder="e.g. Node.js"
                      />
                      {skillFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#1a2326]">
                    Languages
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendLanguage({ value: "" })}
                    className="text-[12px] font-semibold text-[#004f52] hover:text-[#003d40] flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Language
                  </button>
                </div>
                <div className="space-y-3">
                  {languageFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`languages.${index}.value` as const, {
                          required: true,
                        })}
                        className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                        placeholder="e.g. English"
                      />
                      {languageFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e6ebeb] pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1a2326]">
                Experience
              </h3>
              <button
                type="button"
                onClick={() => appendExperience({ title: "", description: "" })}
                className="text-sm font-semibold text-[#004f52] hover:text-[#003d40] flex items-center gap-1 rounded bg-[#f0f4f4] px-3 py-1.5 transition"
              >
                <Plus className="h-4 w-4" /> Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {experienceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-[#f8fbfb] rounded-lg border border-[#e6ebeb] relative group"
                >
                  {experienceFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="absolute right-3 top-3 p-1.5 text-red-500 hover:bg-red-100 rounded opacity-50 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="grid gap-3 mr-10">
                    <input
                      {...register(`experience.${index}.title` as const, {
                        required: true,
                      })}
                      className="w-full rounded-md border border-[#d6dddd] px-3 py-1.5 text-sm font-medium focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                      placeholder="Title (e.g. Senior Backend Engineer)"
                    />
                    <textarea
                      {...register(`experience.${index}.description` as const, {
                        required: true,
                      })}
                      rows={2}
                      className="w-full rounded-md border border-[#d6dddd] px-3 py-1.5 text-sm resize-none focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                      placeholder="Description of your role and impact..."
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#e6ebeb] pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1a2326]">
                Support Offerings
              </h3>
              <button
                type="button"
                onClick={() => appendSupport({ title: "", description: "" })}
                className="text-sm font-semibold text-[#004f52] hover:text-[#003d40] flex items-center gap-1 rounded bg-[#f0f4f4] px-3 py-1.5 transition"
              >
                <Plus className="h-4 w-4" /> Add Support Offering
              </button>
            </div>
            <div className="space-y-4">
              {supportFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-[#f8fbfb] rounded-lg border border-[#e6ebeb] relative group"
                >
                  {supportFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSupport(index)}
                      className="absolute right-3 top-3 p-1.5 text-red-500 hover:bg-red-100 rounded opacity-50 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="grid gap-3 mr-10">
                    <input
                      {...register(`support.${index}.title` as const, {
                        required: true,
                      })}
                      className="w-full rounded-md border border-[#d6dddd] px-3 py-1.5 text-sm font-medium focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                      placeholder="Title (e.g. Career Guidance)"
                    />
                    <textarea
                      {...register(`support.${index}.description` as const, {
                        required: true,
                      })}
                      rows={2}
                      className="w-full rounded-md border border-[#d6dddd] px-3 py-1.5 text-sm resize-none focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                      placeholder="Helping developers choose the right career path..."
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#e6ebeb] pt-8">
            <h3 className="text-lg font-semibold text-[#1a2326] mb-4">
              Pricing & Motivation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#f0f4f4]/50 rounded-xl border border-[#e0e8e8]">
              <div>
                <label className="flex items-center gap-3 cursor-pointer mb-5">
                  <input
                    type="checkbox"
                    {...register("isPaidSession")}
                    className="h-5 w-5 rounded border-gray-300 text-[#004f52] focus:ring-[#004f52]"
                  />
                  <span className="text-sm font-medium text-[#2c3135]">
                    I charge for my sessions
                  </span>
                </label>

                {isPaidSession && (
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                      Hourly Rate (USD) <span className="text-red-500">*</span>
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-[#7a99b8]">
                        $
                      </span>
                      <input
                        type="number"
                        {...register("hourlyRate", { required: isPaidSession })}
                        className="w-full rounded-lg border border-[#d6dddd] pl-7 pr-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                        placeholder="45"
                      />
                    </div>
                  </label>
                )}

                <label className="block mt-4">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Booking Link <span className="text-red-500">*</span>
                  </span>
                  <input
                    {...register("bookingLink", { required: true })}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="https://calendly.com/..."
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Motivation
                  </span>
                  <textarea
                    {...register("motivation")}
                    rows={2}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm resize-none focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="I want to share my knowledge..."
                  ></textarea>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#4a5559]">
                    Goal
                  </span>
                  <textarea
                    {...register("goal")}
                    rows={2}
                    className="w-full rounded-lg border border-[#d6dddd] px-4 py-2 text-sm resize-none focus:border-[#004f52] focus:outline-none focus:ring-1 focus:ring-[#004f52]"
                    placeholder="Help 100 developers become confident..."
                  ></textarea>
                </label>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#e6ebeb] pt-6 pb-2 flex justify-end gap-3 items-center z-20">
            <div className="flex items-center text-xs text-[#7a99b8] mr-auto">
              <Info className="h-4 w-4 mr-1.5" /> Required fields marked with *
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border border-[#d6dddd] px-6 py-2.5 text-[14px] font-semibold text-[#5b6e70] transition hover:bg-[#f8fbfb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-w-[140px] items-center justify-center rounded-[8px] bg-[#004f52] px-8 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#003d40] shadow-md shadow-[#004f52]/20 disabled:opacity-70 cursor-pointer"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
