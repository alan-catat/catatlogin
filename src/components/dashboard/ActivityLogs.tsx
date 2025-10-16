"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { exportToExcel } from "@/utils/exportExcel";

interface ActivityLog {
  id: number;
  user: string;
  activity: string;
  timestamp: string;
  status: "Success" | "Warning" | "Failed";
  avatar: string;
}

export default function ActivityLogs() {
  const supabase = createClient();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("id, action, description, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Gagal fetch activity logs:", error.message);
        return;
      }

      const mapped: ActivityLog[] = (data || []).map((log: any) => ({
        id: log.id,
        user: log.user_id || "Unknown User",
        activity: log.action || log.description || "-",
        timestamp: new Date(log.created_at).toLocaleString(),
        status: "Success", // sementara default, nanti bisa diambil dari kolom `status`
        avatar: "/images/user/default.jpg",
      }));

      setLogs(mapped);
    };

    fetchLogs();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Activity Log
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button  
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={() =>
              exportToExcel(logs, {
                fileName: "activity_logs.xlsx",
                isAdmin: true, // bisa diganti false kalau user biasa
                userId: "123", // kalau bukan admin, filter by user_id
              })
            }
            >
            Export
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader>Activity</TableCell>
              <TableCell isHeader>Timestamp</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-300">
                  {log.activity}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {log.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
