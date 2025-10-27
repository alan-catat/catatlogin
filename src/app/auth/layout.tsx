import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { ENVIRONMENT_SYSTEM, brandColors  } from "@/constants/test-data"; // pastikan ini berisi APP_NAME dan logo

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appLogo = ENVIRONMENT_SYSTEM.appLogo; // logo default
  const appName = ENVIRONMENT_SYSTEM.appName || "Financial Extraktor"; // default APP_NAME

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full lg:flex lg:items-center lg:justify-center hidden relative">
            {/* Background gradient + grid shapes */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                background: `linear-gradient(105deg, #2e2e2e)`,
              }}
            >
              <GridShape />
            </div>

            {/* Logo & App Name */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <Image
                  width={150}
                  height={100}
                  src={appLogo}
                  alt={appName}
                  className="rounded-full"
                />
              </div>

              <p className="text-white dark:text-gray-400 max-w-xs">
                Selamat datang di {appName} <br /> Sekarang catat apapun gak perlu repot lagi.
              </p>
            </div>
          </div>


          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
