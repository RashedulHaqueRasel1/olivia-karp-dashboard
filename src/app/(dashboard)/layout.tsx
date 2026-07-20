import React from "react";
import Sidebar from "@/components/sheard/Sidebar";
import Header from "@/components/sheard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar: Fixed on large screens */}
      <div className="hidden lg:block">
        <Sidebar className="w-72 border-r bg-card h-full" />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header: Sticky at the top */}
        <Header />

        {/* Main Content Area: Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto container animate-in fade-in slide-in-from-bottom duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
