import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import PackageClient from "./PackageClient";

export const metadata: Metadata = {
  title: "FINANCIAL-EXTRACTOR | DASHBOARD",
};

export default function PackagesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Packages" role="admin"  />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <PackageClient />
      </div>
    </div>
  );
}
