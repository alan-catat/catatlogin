import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import GroupClient from "./GroupClient";

export const metadata: Metadata = {
  title: "FINANCIAL-EXTRACTOR | DASHBOARD",
};

export default async function Groups() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Groups" role="admin"  />
        <GroupClient/>
    </div>
  );
}
