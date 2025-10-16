"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useState, useEffect } from "react";
import { AlertProvider } from "@/components/ui/alert/Alert";
import { ENVIRONMENT_SYSTEM } from "@/constants/test-data";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  // state logo untuk light & dark
  const [appLogo, setAppLogo] = useState<{ light: string; dark: string }>({
    light: ENVIRONMENT_SYSTEM.appLogo,
    dark: ENVIRONMENT_SYSTEM.appDarkLogo || ENVIRONMENT_SYSTEM.appLogo,
  });
  
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const supabase = createClient();

  // Fetch app logo dari Supabase
  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("key, value")
        .in("key", ["LOGO_APP", "LOGO_DARK"]);

      if (error) {
        console.error("Failed to fetch logos:", error);
        return;
      }

      const logoApp =
        data.find((row) => row.key === "LOGO_APP")?.value ||
        ENVIRONMENT_SYSTEM.appLogo;

      const logoDark =
        data.find((row) => row.key === "LOGO_DARK")?.value ||
        ENVIRONMENT_SYSTEM.appDarkLogo ||
        ENVIRONMENT_SYSTEM.appLogo;

      setAppLogo({ light: logoApp, dark: logoDark });
    };

    fetchLogos();
  }, [supabase]);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar role="user" appLogo={appLogo} />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader userRole="user" />  {/* ✅ kirim role */}

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <AlertProvider>{children}</AlertProvider>
        </div>
      </div>
    </div>
  );
}
