"use client";

import Link from "next/link";
import React, { createContext, useContext, useState } from "react";

interface AlertData {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

interface AlertContextType {
  setAlertData: (data: AlertData | null) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertData, _setAlertData] = useState<AlertData | null>(null);
  const setAlertData = (data: AlertData | null) => {
    _setAlertData(data);

    // kalau ada alert baru, auto hilang setelah 5 detik
    if (data && data.variant !== "warning") {
      setTimeout(() => {
        _setAlertData(null);
      }, 5000);
    }
  };
  const variantClasses = {
    success: {
      container:
        "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
      icon: "text-success-500",
    },
    error: {
      container:
        "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
      icon: "text-error-500",
    },
    warning: {
      container:
        "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
      icon: "text-warning-500",
    },
    info: {
      container:
        "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
      icon: "text-blue-light-500",
    },
  };

  return (
    <AlertContext.Provider value={{ setAlertData }}>
      {alertData && (
        <div
          className={`rounded-xl border p-4 mb-4 ${variantClasses[alertData.variant].container}`}
        >
          <div className="flex items-start gap-3">
            <div className={`-mt-0.5 ${variantClasses[alertData.variant].icon}`}>
              {/* Icon */}
            </div>
            <div>
              <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                {alertData.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {alertData.message}
              </p>
              {alertData.showLink && (
                <Link
                  href={alertData.linkHref || "#"}
                  className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
                >
                  {alertData.linkText || "Learn more"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  );
};
