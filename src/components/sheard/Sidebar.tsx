"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  Briefcase,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MonitorPlay,
  Search,
  Settings,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogoutModal } from "./LogoutModal";
import { signOut } from "next-auth/react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const contentManagementSubItems = [
  { title: "Create Job Post", href: "/content-management/create-job-post" },
  { title: "Create Media Post", href: "/content-management/create-media-post" },
  { title: "Create Blog Post", href: "/content-management/create-blog-post" },
  { title: "Create Event Post", href: "/content-management/create-event-post" },
];

const menuItems = [
  {
    title: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard-overview",
  },
  {
    title: "Content Management",
    icon: MonitorPlay,
    href: "/content-management",
    hasSubmenu: true,
  },
  {
    title: "Opportunities Management",
    icon: Briefcase,
    href: "/opportunities",
  },
  {
    title: "Mentor & Coaches",
    icon: Users,
    href: "/mentors-coaches",
  },
  {
    title: "Courses",
    icon: GraduationCap,
    href: "/courses",
  },
  {
    title: "Reviews",
    icon: Star,
    href: "/reviews",
  },
  {
    title: "Notification",
    icon: Bell,
    href: "/notifications",
  },

  {
    title: "User Data",
    icon: Search,
    href: "/user-data",
  },
  {
    title: "Meet Our Team",
    icon: Users,
    href: "/meet-the-team",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const isContentManagementActive = pathname.startsWith("/content-management");
  const [isContentOpen, setIsContentOpen] = useState(isContentManagementActive);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    // Clear all potential data
    localStorage.clear();
    sessionStorage.clear();

    // Sign out from NextAuth and redirect to login
    await signOut({ callbackUrl: "https://actonclimate.co/" });
    setIsLogoutModalOpen(false);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white shadow-sm border-r w-72",
        className,
      )}
    >
      {/* Brand Section */}
      <div className="p-8 flex flex-col items-center justify-center">
        <Link
          href="/dashboard-overview"
          className="flex flex-col items-center gap-2"
        >
          <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          if (item.hasSubmenu) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => setIsContentOpen((prev) => !prev)}
                  className={cn(
                    "group flex items-center gap-4 px-4 py-4 text-[15px] font-semibold rounded-xl transition-all duration-200 w-full cursor-pointer",
                    isContentManagementActive
                      ? "bg-primary text-white shadow-lg shadow-[#00474b]/20"
                      : "text-primary hover:bg-primary/5",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isContentManagementActive ? "text-white" : "text-primary",
                    )}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span>Content Manage...</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isContentOpen && "rotate-90",
                      )}
                    />
                  </div>
                </button>

                {isContentOpen && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                    {contentManagementSubItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200",
                            isSubActive
                              ? "text-primary font-semibold bg-primary/5"
                              : "text-gray-600 hover:text-primary hover:bg-primary/5",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-4 py-4 text-[15px] font-semibold rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-[#00474b]/20"
                  : "text-primary hover:bg-primary/5",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-primary",
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session Section */}
      <div className="p-6 mt-auto">
        {/* <div className="flex items-center gap-3 mb-6 px-2">
          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
            <AvatarImage
              src="/images/avatar-placeholder.png"
              alt="Olivia Karp"
            />
            <AvatarFallback className="bg-[#00474b]/10 text-[#00474b] font-bold">
              OK
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#00474b]">
              Olivia Karp
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Admin
            </span>
          </div>
        </div> */}

        <Button
          variant="outline"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full justify-center gap-2 border-[1.5px] border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white transition-all duration-300 rounded-xl h-11 font-bold"
        >
          <LogOut className="h-5 w-5 transform rotate-180" />
          Log out
        </Button>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </aside>
  );
}
