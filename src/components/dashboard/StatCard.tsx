"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  compare?: string; // ✅ opsional
}


export function StatCard({ title, value, change, compare }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.05]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-2">
        {value}
      </h2>
      <div className="text-xs font-medium mt-1 flex items-center gap-1">
        <span
          className={change.startsWith("-") ? "text-red-500" : "text-green-600"}
        >
          {change}
        </span>
        {compare && (
          <span className="text-gray-400">{compare}</span>
        )}
      </div>
    </div>
  );
}

