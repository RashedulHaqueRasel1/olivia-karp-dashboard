"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyProfile } from "@/features/settings/hooks/useSettings";

export default function Header() {
  const { data } = useMyProfile();
  const user = data?.data;

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "";

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white px-8 md:px-10 border-b border-muted/20 bg-white shadow-sm border-r">
      {/* Search Bar - Left Aligned */}
      <div className="flex items-center w-full max-w-sm md:max-w-lg">
        <div className="relative flex w-full">
          <Input
            placeholder="Search by Category Name"
            className="flex-1 h-12 rounded-l-xl rounded-r-none border-[#004242]/10 bg-[#FFFF] focus-visible:ring-primary/20 focus-visible:border-primary/30 placeholder:text-muted-foreground/50 transition-all text-sm font-medium"
          />
          <Button className="h-12 w-16 rounded-r-xl rounded-l-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all p-0 flex items-center justify-center">
            <Search className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>

      {/* User Profile - Right Aligned */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-foreground tracking-tight">
          {fullName || "Admin"}
        </span>
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm hover:shadow-md transition-shadow">
          <AvatarImage src={user?.image?.url} alt={fullName || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
