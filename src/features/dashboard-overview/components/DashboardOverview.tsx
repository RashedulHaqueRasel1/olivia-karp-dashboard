"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Image as ImageIcon,
  PlusSquare,
  Upload,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useDashboardChartOverview,
  useDashboardOverview,
} from "../hooks/useDashboardOverview";
import RecentActivityTable from "./RecentActivityTable";

const quickActions = [
  {
    icon: PlusSquare,
    label: "Job Post",
    href: "/content-management/create-job-post",
  },
  { icon: Upload, label: "Upload Course", href: "/courses" },
  {
    icon: FileText,
    label: "Create Blog",
    href: "/content-management/create-blog-post",
  },
  {
    icon: ImageIcon,
    label: "Add Media",
    href: "/content-management/create-media-post",
  },
  { icon: Users, label: "Add Mentor & Coaches", href: "/mentors-coaches" },
];

export default function DashboardOverview() {
  const router = useRouter();
  const [chartFilter, setChartFilter] = useState("monthly");
  const [chartYear, setChartYear] = useState("2026");

  const { data, isLoading } = useDashboardOverview();
  const { data: chartResponse } = useDashboardChartOverview(
    chartFilter,
    chartYear,
  );

  const analytics = data?.data?.analytics || data?.analytics;
  const rawChartData = chartResponse?.data?.data || chartResponse?.data || {};

  const formattedChartData = Object.entries(rawChartData).map(([key, val]) => {
    const value = val as {
      totalUser?: number;
      count?: number;
      total?: number;
    };

    let shortName = key;

    if (isNaN(Number(key))) {
      shortName = key.charAt(0).toUpperCase() + key.slice(1, 3);
    }

    return {
      name: shortName,
      value1: value?.totalUser || value?.count || value?.total || 0,
      value2: Math.max(
        0,
        (value?.totalUser || value?.count || value?.total || 0) * 0.8,
      ),
    };
  });

  console.log("CHART DEBUG", {
    chartFilter,
    chartResponse,
    rawChartData,
    formattedChartData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const displayStats = [
    {
      title: "Total Members",
      value: analytics?.members?.total || 0,
      change: `${(analytics?.members?.growth || 0) >= 0 ? "+" : ""}${analytics?.members?.growth || 0}%`,
      trend: (analytics?.members?.growth || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Total Subscription",
      value: analytics?.subscriptions?.total || 0,
      change: `${(analytics?.subscriptions?.growth || 0) >= 0 ? "+" : ""}${analytics?.subscriptions?.growth || 0}%`,
      trend: (analytics?.subscriptions?.growth || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Total Mentors and coach",
      value: analytics?.mentors?.total || 0,
      change: `${(analytics?.mentors?.growth || 0) >= 0 ? "+" : ""}${analytics?.mentors?.growth || 0}%`,
      trend: (analytics?.mentors?.growth || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Total Jobs",
      value: analytics?.jobs?.total || 0,
      change: `${(analytics?.jobs?.growth || 0) >= 0 ? "+" : ""}${analytics?.jobs?.growth || 0}%`,
      trend: (analytics?.jobs?.growth || 0) >= 0 ? "up" : "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, i) => (
          <Card key={i} className="border border-[#E2E8F0] shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <span className="text-[#64748B] text-xl font-semibold">
                  {stat.title}
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-[#1A1A1A]">
                    {stat.value}
                  </span>
                  <div
                    className={`flex items-center text-xs font-semibold ${
                      stat.trend === "up" ? "text-[#10B981]" : "text-[#EF4444]"
                    }`}
                  >
                    {stat.change}{" "}
                    {stat.trend === "up" ? (
                      <ArrowUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Chart Card */}
        <Card className="lg:col-span-3 border border-[#E2E8F0] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <CardTitle className="text-lg font-bold text-[#1A1A1A]">
              New Members
            </CardTitle>
            <div className="flex items-center gap-4">
              <Tabs
                value={chartFilter}
                onValueChange={setChartFilter}
                className="w-auto"
              >
                <TabsList className="bg-[#F1F5F9] h-9 p-1">
                  <TabsTrigger value="weekly" className="text-xs px-4">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs px-4">
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs
                value={chartYear}
                onValueChange={setChartYear}
                className="w-auto ml-2"
              >
                <TabsList className="bg-[#F1F5F9] h-9 p-1">
                  <TabsTrigger value="2025" className="text-xs px-4">
                    2025
                  </TabsTrigger>
                  <TabsTrigger value="2026" className="text-xs px-4">
                    2026
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedChartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value1"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#004242" }}
                />
                <Line
                  type="monotone"
                  dataKey="value2"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="lg:col-span-1 border border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1A1A1A]">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="ghost"
                onClick={() => router.push(action.href)}
                className="w-full justify-start h-14 gap-4 text-[#004242] font-semibold hover:bg-[#F8FAFB] border-2 border-transparent hover:border-[#E2E8F0] border-[#E2E8F0]  rounded-xl px-4 py-8 cursor-pointer"
              >
                <div className="bg-[#F8FAFB] p-2 rounded-lg group-hover:bg-[#E2E8F0] transition-colors">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable />
    </div>
  );
}
