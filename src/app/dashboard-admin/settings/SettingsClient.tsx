"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

interface SettingsClientProps {
  isAdmin: boolean;
}

export default function SettingsClient({ isAdmin }: SettingsClientProps) {
  const [envRows, setEnvRows] = useState([{ key: "", value: "" }]);
  const [apiKey] = useState("1234-ABCD-5678-EFGH"); // contoh dummy api key

  const addRow = () => {
    setEnvRows([...envRows, { key: "", value: "" }]);
  };

  const updateRow = (index: number, field: "key" | "value", newValue: string) => {
    const newRows = [...envRows];
    newRows[index][field] = newValue;
    setEnvRows(newRows);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key berhasil disalin!");
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-6">

      {/* Card Edit Password */}
      <div className="rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700 dark:bg-white/[0.05]">
        <h3 className="text-lg font-semibold mb-2">Edit Password</h3>
        <p className="text-sm text-gray-500 mb-4">Ubah password akun Anda untuk keamanan yang lebih baik.</p>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Simpan
          </button>
        </div>
      </div>

      {/* Card Environment Setting (Admin Only) */}
      {isAdmin && (
        <>
          <div className="rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700 dark:bg-white/[0.05]">
            <h3 className="text-lg font-semibold mb-2">Environment Setting</h3>
            <p className="text-sm text-gray-500 mb-4">Konfigurasi variabel lingkungan sistem.</p>

            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Parameter</th>
                  <th className="px-3 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {envRows.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={row.key}
                        onChange={(e) => updateRow(idx, "key", e.target.value)}
                        placeholder="PARAM_NAME"
                        className="w-full rounded-md border px-2 py-1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => updateRow(idx, "value", e.target.value)}
                        placeholder="Value"
                        className="w-full rounded-md border px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex gap-2">
              <button
                onClick={addRow}
                className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                + Tambah Row
              </button>
              <button className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
                Simpan
              </button>
            </div>
          </div>

          {/* Card API Setting */}
          <div className="rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700 dark:bg-white/[0.05]">
            <h3 className="text-lg font-semibold mb-2">API Setting</h3>
            <p className="text-sm text-gray-500 mb-4">Kelola API keys dan konfigurasi endpoint.</p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="w-full rounded-md border px-3 py-2 text-sm bg-gray-100"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
