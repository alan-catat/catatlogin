"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { exportToExcel } from "@/utils/exportExcel";

interface ReportLog {
  id: string;
  email: string | null;
  action: string;
  description: string | null;
  created_at: string;
}

export default function ReportLogsPage() {
  const [logs, setLogs] = useState<ReportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const supabase = createClient();

  useEffect(() => {
    fetchLogs();
  }, [search, page, pageSize]);

  const fetchLogs = async () => {
    setLoading(true);
  
    const { data, error } = await supabase.rpc("get_activity_logs", {
      search_query: search || null, // 🔹 tambahkan search
      limit_count: pageSize,
      offset_count: (page - 1) * pageSize,
    });
  
    if (error) {
      console.error("Gagal ambil logs:", error.message);
      setLogs([]);
    } else {
      setLogs(data || []);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          REPORT LOGS
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-80 px-3 py-2 text-sm border rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 
                     dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
        />

        <button
          onClick={() =>
            exportToExcel(logs, {
              fileName: "report-logs.xlsx",
              sheetName: "Logs",
              isAdmin: true, // atau false jika ingin filter berdasarkan user
              // userId: currentUserId, // opsional, jika bukan admin
            })
          }
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Export
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Email</th>
              <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Action</th>
              <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Description</th>
              <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600 dark:text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t hover:bg-gray-50 
                             dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <td className="p-3 text-gray-700 dark:text-gray-200">{log.email || "-"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{log.action}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{log.description}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 
                       dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded transition-colors 
                       disabled:opacity-50 
                       hover:bg-gray-100 dark:hover:bg-gray-800 
                       dark:border-gray-700 dark:text-gray-200"
          >
            Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded transition-colors 
                       hover:bg-gray-100 dark:hover:bg-gray-800 
                       dark:border-gray-700 dark:text-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

}
