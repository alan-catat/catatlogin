"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  type: string;
  group_id?: string | null;
}

interface Group {
  id: string;
  name: string;
}

interface Props {
  category: Category;
  groups: Group[];
}

export default function CategoryActions({ category, groups }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [type, setType] = useState(category.type);
  const [groupId, setGroupId] = useState(category.group_id || "");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdate = async () => {
    if (!name || !type) {
      alert("Nama & tipe wajib diisi!");
      return;
    }

    setLoading(true);

    let iconUrl = category.icon || null;

    // Upload icon baru kalau ada file
    if (iconFile) {
      const fileExt = iconFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `category-icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("category-icons")
        .upload(filePath, iconFile, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        alert("Gagal upload icon.");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("category-icons")
        .getPublicUrl(filePath);
      iconUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("list_categories")
      .update({ name, type, group_id: groupId, icon: iconUrl })
      .eq("id", category.id);

    setLoading(false);

    if (error) {
      console.log(error);
      alert("Gagal update kategori.");
      return;
    }

    setIsEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Yakin hapus kategori ini?")) return;

    const { error } = await supabase
      .from("list_categories")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", category.id);

    if (error) {
      console.log(error);
      alert("Gagal hapus kategori.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      {/* Edit */}
      <button
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
      >
        Edit
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="px-2 py-1 text-xs bg-red-600 text-white rounded"
      >
        Delete
      </button>

      {/* Modal edit */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Kategori</h3>

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
            <div className="mb-3">
              <label className="block text-sm mb-1">Icon</label>
              {category.icon && !iconFile && (
                <img
                  src={category.icon}
                  alt="current icon"
                  className="w-10 h-10 mb-2 rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
