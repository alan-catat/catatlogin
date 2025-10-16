import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import CategoryActions from "./CategoryActions";
import AddCategoryButton from "./AddCategoryButton";

export const metadata: Metadata = {
  title: "FINANCIAL-EXTRACTOR | DASHBOARD",
};


interface Category {
  id: string;
  name: string;
  icon: string;
  type: string;
  created_at: string;
  group_id?: string | null;
  groups?: { id: string; name: string } | null;
}


const PAGE_SIZE = 10;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams; // ✅ wajib di await
  const page = Number(params?.page ?? "1");
  const search = (params?.search as string) ?? "";
  const groupFilter = (params?.group as string) ?? "";
  const typeFilter = (params?.type as string) ?? "";
  const supabase = await createClient();



  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Ambil daftar group untuk dropdown
  const { data: groups } = await supabase
    .from("groups")
    .select("id, name")
    .is("deleted_at", null);

  // Hitung total data (sesuai filter)
  let countQuery = supabase
    .from("list_categories")
    .select("id", { count: "exact", head: true })
    .ilike("name", `%${search}%`)
    .is("deleted_at", null);

  if (groupFilter) countQuery = countQuery.eq("group_id", groupFilter);
  if (typeFilter) countQuery = countQuery.eq("type", typeFilter);

  const { count } = await countQuery;
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  // ambil data kategori dengan relasi group
  let dataQuery = supabase
    .from("list_categories")
    .select("id, name, type, created_at, group_id, groups(id, name)")
    .ilike("name", `%${search}%`)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (groupFilter) dataQuery = dataQuery.eq("group_id", groupFilter);
  if (typeFilter) dataQuery = dataQuery.eq("type", typeFilter);
  const { data: categories, error } = await dataQuery as {
    data: Category[] | null;
    error: any;
  };


  if (error) {
    console.error(error);
    return <div className="p-6 text-red-600">Gagal mengambil data kategori.</div>;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Global Categories" role="admin" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white shadow-sm px-5 py-7 
                      dark:border-gray-800 dark:bg-gray-900 xl:px-10 xl:py-12">
        {/* Filter Bar */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="flex flex-wrap gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari kategori..."
              className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />

            <select
              name="group"
              defaultValue={groupFilter}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">Semua Group</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              name="type"
              defaultValue={typeFilter}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">Semua Tipe</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white 
                         hover:bg-indigo-700 transition"
            >
              Filter
            </button>
          </form>

          <AddCategoryButton groups={groups || []} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Group</th>
                <th className="px-4 py-2 text-left">Tipe</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors
                               dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {from + index + 1}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      {cat.icon && (
                        <img
                          src={cat.icon}
                          alt={cat.name}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span>{cat.name}</span>
                    </td>

                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {cat.groups?.name || "-"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${cat.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                          }`}
                      >
                        {cat.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {new Date(cat.created_at!).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <CategoryActions category={cat} groups={groups || []} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
          </span>
          <div className="space-x-2">
            <a
              href={`?page=${page - 1}&search=${search}&group=${groupFilter}&type=${typeFilter}`}
              className={`px-3 py-1 rounded-lg border transition-colors
                ${page <= 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"}`}
            >
              Sebelumnya
            </a>

            <a
              href={`?page=${page + 1}&search=${search}&group=${groupFilter}&type=${typeFilter}`}
              className={`px-3 py-1 rounded-lg border transition-colors
                ${page >= totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"}`}
            >
              Selanjutnya
            </a>
          </div>

        </div>
      </div>
    </div>
  );

}
