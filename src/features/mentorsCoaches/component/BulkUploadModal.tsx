import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Download,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import { useBulkUploadMentorsCoaches } from "../hooks/useMentorsCoaches";
import { BulkUploadResponse } from "../types/mentor.types";

interface BulkUploadModalProps {
  onClose: () => void;
}

export function BulkUploadModal({ onClose }: BulkUploadModalProps) {
  const { mutate: bulkUpload, isPending } = useBulkUploadMentorsCoaches();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<BulkUploadResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setErrorMessage(null);
      } else {
        setErrorMessage("Please upload a valid CSV file (.csv)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setErrorMessage(null);
      } else {
        setErrorMessage("Please upload a valid CSV file (.csv)");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    bulkUpload(file, {
      onSuccess: (response: unknown) => {
        // Handle standard API response or standard wrapper response
        // Usually, the response object from axiosInstance could be wrapped
        const apiResponse = response as BulkUploadResponse;
        if (apiResponse.success) {
          setResult(apiResponse);
          setErrorMessage(null);
        } else {
          setErrorMessage(apiResponse.message || "Failed to upload file.");
        }
      },
      onError: (err: unknown) => {
        let errorMsg = "An error occurred during bulk upload.";
        if (err instanceof Error) {
          errorMsg = err.message;
        }
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        if (axiosError?.response?.data?.message) {
          errorMsg = axiosError.response.data.message;
        }
        setErrorMessage(errorMsg);
      },
    });
  };

  // Helper to trigger download of a template CSV
  const downloadTemplate = () => {
    const csvContent =
      "firstName,lastName,email,phone,bio,about,type,experienceYears,availability,linkedin,website,isPaidSession,hourlyRate,bookingLink,motivation,goal\n" +
      "John,Doe,john.doe@example.com,+1234567890,Senior Developer & Mentor,I love mentoring developers,mentor,8,Mon-Fri 6PM-9PM,https://linkedin.com/in/johndoe,https://johndoe.com,true,50,https://calendly.com/johndoe,To give back,Help others grow\n" +
      "Jane,Smith,jane.smith@example.com,+1987654321,Leadership & Career Coach,Helping professionals lead teams,coach,12,Weekends 9AM-12PM,https://linkedin.com/in/janesmith,https://janesmith.com,false,0,https://calendly.com/janesmith,To share leadership insights,Empower women in tech";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mentors_coaches_bulk_upload_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#001014]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-[16px] bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f4] text-[#5b6e70] transition hover:bg-[#e0e6e6] z-20"
        >
          <X className="h-4 w-4" />
        </button>

        {!result ? (
          <div>
            <div className="mb-6 border-b border-[#e6ebeb] pb-4">
              <h2 className="text-xl font-bold text-[#1a2326] flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-[#004f52]" />
                Bulk Upload Mentors & Coaches
              </h2>
              <p className="mt-1 text-sm text-[#7a99b8]">
                Upload a CSV file to import multiple mentor/coach records in
                bulk.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Drag and Drop Container */}
              <div
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition cursor-pointer ${
                  dragActive
                    ? "border-[#004f52] bg-[#f0f9f9]"
                    : "border-[#8db3b5] hover:bg-[#f8fbfb] bg-white"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv"
                />

                <UploadCloud className="h-12 w-12 text-[#004f52] mb-3 animate-pulse" />
                <p className="text-sm font-semibold text-[#1a2326] text-center">
                  Drag and drop your CSV file here, or{" "}
                  <span className="text-[#004f52] underline">browse files</span>
                </p>
                <p className="mt-1 text-xs text-[#7a99b8]">
                  Supports .csv files only
                </p>
              </div>

              {/* Selected File Details */}
              {file && (
                <div className="flex items-center justify-between rounded-lg border border-[#dde7eb] bg-[#fcfdfe] p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef3ff] text-[#6f8cff]">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#384148]">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#8a939a]">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-1.5 text-[#d9534f] hover:bg-[#fff2e8] rounded-lg transition"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Template download link */}
              {/* <div className="flex items-center justify-between rounded-lg bg-[#f4fbfb] p-3 text-sm text-[#32545b] border border-[#d2e5e6]">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-[#004f52]" />
                  <span>Need the correct file format?</span>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="text-xs font-bold text-[#004f52] underline hover:text-[#003d40]"
                >
                  Download Template CSV
                </button>
              </div> */}

              {/* Error messages */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 rounded-lg bg-[#fff2e8] p-3.5 text-sm text-[#d58a53] border border-[#ffe0cc]">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#d58a53] mt-0.5" />
                  <p className="leading-5">{errorMessage}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-[#e6ebeb] pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-[8px] border border-[#d6dddd] px-5 py-2 text-[14px] font-semibold text-[#5b6e70] transition hover:bg-[#f8fbfb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || isPending}
                  className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-[8px] bg-[#004f52] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#003d40] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#004f52]/10"
                >
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    "Upload File"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Result View */
          <div>
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f8ea] text-[#31c95f] mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2326]">
                Bulk Upload Completed
              </h2>
              <p className="mt-2 text-sm text-[#5f686d] max-w-sm px-4">
                {result.message ||
                  "Your CSV upload and import was processed successfully."}
              </p>
            </div>

            {/* Upload counts details */}
            <div className="mt-4 grid grid-cols-2 gap-3 bg-[#f8fbfb] p-4 rounded-xl border border-[#e0e8e8]">
              <div className="text-center p-2 rounded-lg bg-white border border-[#eef3f3] shadow-sm">
                <p className="text-xs font-semibold text-[#7a99b8] uppercase tracking-wider">
                  Created
                </p>
                <p className="text-3xl font-extrabold text-[#31c95f] mt-1">
                  {result.data?.createdCount ?? 0}
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white border border-[#eef3f3] shadow-sm">
                <p className="text-xs font-semibold text-[#7a99b8] uppercase tracking-wider">
                  Updated
                </p>
                <p className="text-3xl font-extrabold text-[#6e9ed9] mt-1">
                  {result.data?.updatedCount ?? 0}
                </p>
              </div>
            </div>

            {/* Validation errors/warnings */}
            {result.data?.errors && result.data.errors.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-[#1a2326] flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-4 w-4 text-[#d58a53]" />
                  Validation Warnings ({result.data.errors.length})
                </h3>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-[#ffe0cc] bg-[#fffcfb] p-3 text-xs text-[#b86d38] space-y-1.5">
                  {result.data.errors.map((err, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="font-bold text-[#d58a53] flex-shrink-0">
                        •
                      </span>
                      <span className="leading-4">{err}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Action Button */}
            <div className="mt-6 border-t border-[#e6ebeb] pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-[8px] bg-[#004f52] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#003d40] shadow-md shadow-[#004f52]/10"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
