"use client";
import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.05]">
      <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
        {title}
      </h3>
      <div className="w-full">{children}</div>
    </div>
  );
}
