import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FINANCIAL-EXTRACTOR | DASHBOARD",
};

export default async function Users() {
  // TODO: Nanti sambungkan ke n8n untuk ambil data user
  const users: any[] = []; // kosongkan dulu

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" role="admin" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-5xl">
          <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Daftar Pengguna
          </h3>

          {users.length === 0 ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Data pengguna belum tersedia (Supabase dimatikan).
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border text-sm text-left text-gray-500 dark:text-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">User ID</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Dibuat</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t dark:border-gray-700">
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
