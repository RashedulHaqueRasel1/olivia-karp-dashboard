"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useDashboardRecentActivity } from "../hooks/useDashboardOverview";

interface ActivityItem {
  _id: string;
  title: string;
  type: string;
  submittedBy: string;
  date: string;
  status: string;
}

export default function RecentActivityTable() {
  const [viewingActivity, setViewingActivity] = useState<ActivityItem | null>(
    null,
  );
  const { data, isLoading, isError } = useDashboardRecentActivity();

  const activities: ActivityItem[] = data?.data || [];

  if (isLoading) {
    return (
      <Card className="border border-[#E2E8F0] shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1A1A1A]">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-[#64748B]">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border border-[#E2E8F0] shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1A1A1A]">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-red-500">
          Failed to load recent activity.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#E2E8F0] shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#1A1A1A]">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFB]">
                <th className="px-6 py-4 text-left font-semibold text-[#64748B]">
                  Title
                </th>
                <th className="px-6 py-4 text-left font-semibold text-[#64748B]">
                  Type
                </th>
                <th className="px-6 py-4 text-left font-semibold text-[#64748B]">
                  Submitted By
                </th>
                <th className="px-6 py-4 text-left font-semibold text-[#64748B]">
                  Date
                </th>
                <th className="px-6 py-4 text-center font-semibold text-[#64748B]">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-semibold text-[#64748B]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <tr
                    key={activity._id}
                    className={`border-b border-[#E2E8F0] transition hover:bg-[#F8FAFB] ${
                      index === activities.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-[250px] truncate font-medium text-[#1A1A1A]">
                        {activity.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-[#F1F5F9] px-2 py-1 text-xs font-medium text-[#475569]">
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#475569]">
                      {activity.submittedBy}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${
                          activity.status.toLowerCase() === "pending"
                            ? "bg-[#FEF3C7] text-[#D97706]"
                            : activity.status.toLowerCase() === "approved"
                              ? "bg-[#D1FAE5] text-[#059669]"
                              : "bg-[#F1F5F9] text-[#475569]"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setViewingActivity(activity)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-[#64748B]"
                  >
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog
        open={!!viewingActivity}
        onOpenChange={(open) => !open && setViewingActivity(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#1A1A1A]">
              Activity Details
            </DialogTitle>
          </DialogHeader>
          {viewingActivity && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#64748B]">Title</h4>
                <p className="mt-1 text-base text-[#1A1A1A]">
                  {viewingActivity.title}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#64748B]">Type</h4>
                  <p className="mt-1 text-base text-[#1A1A1A]">
                    {viewingActivity.type}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#64748B]">
                    Submitted By
                  </h4>
                  <p className="mt-1 text-base text-[#1A1A1A]">
                    {viewingActivity.submittedBy}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#64748B]">Date</h4>
                  <p className="mt-1 text-base text-[#1A1A1A]">
                    {new Date(viewingActivity.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#64748B]">Status</h4>
                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${
                        viewingActivity.status.toLowerCase() === "pending"
                          ? "bg-[#FEF3C7] text-[#D97706]"
                          : viewingActivity.status.toLowerCase() === "approved"
                            ? "bg-[#D1FAE5] text-[#059669]"
                            : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {viewingActivity.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
