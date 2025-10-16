"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface AddCategoryButtonProps {
  groups: { id: string; name: string }[];
}

export default function AddCategoryButton({ groups }: AddCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [groupId, setGroupId] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !type || !groupId) {
      alert("Semua field wajib diisi!");
      return;
    }

    setLoading(true);

    let iconUrl =
      "https://abukgzduhmikhhquihbh.supabase.co/storage/v1/object/public/category-icons/favicon.ico"; // default

    // upload file jika ada
    if (iconFile) {
      const fileExt = iconFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `category-icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("category-icons")
        .upload(filePath, iconFile);

      if (uploadError) {
        console.error(uploadError);
        alert("Gagal upload icon.");
        setLoading(false);
        return;
      }

      // ambil public URL
      const { data } = supabase.storage
        .from("category-icons")
        .getPublicUrl(filePath);
      iconUrl = data.publicUrl;
    }

    const { error } = await supabase.from("list_categories").insert([
      {
        name,
        type,
        group_id: groupId,
        icon: iconUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Gagal menyimpan kategori.");
      return;
    }

    setOpen(false);
    setName("");
    setType("");
    setGroupId("");
    setIconFile(null);
    router.refresh(); // refresh data tanpa reload seluruh halaman
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        + Tambah
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Tambah Kategori</h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
              placeholder="Nama kategori"
            />

            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            >
              <option value="">Pilih Group</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            >
              <option value="">Pilih Tipe</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {/* Upload icon */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIconFile(e.target.files?.[0] || null)}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
