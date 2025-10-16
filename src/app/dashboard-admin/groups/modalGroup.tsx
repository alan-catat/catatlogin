"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onDelete?: (id: string) => void;
  initialData?: {
    id: string;
    name: string;
    description: string;
    created_at: string;
  } | null;
  fetchGroups?: () => void;
}

export default function ModalGroup({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  fetchGroups,
}: GroupModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Nama group tidak boleh kosong.");
      return;
    }

    onSubmit?.({ id: initialData?.id, name, description });
    onClose();

    // Refresh data secara manual
    fetchGroups?.();
  };

  const handleDelete = () => {
    if (initialData?.id && confirm("Yakin ingin menghapus group ini?")) {
      onDelete?.(initialData.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
    >
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
        {initialData ? "Edit Group" : "Tambah Group"}
      </h2>
  
      <div className="space-y-4">
        {/* Nama Group */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Nama Group
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 
                       bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
  
        {/* Deskripsi Group */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Deskripsi
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-2 
                       bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
  
        {/* Tombol Aksi */}
        <div className="flex justify-between items-center pt-4">
          {initialData?.id && (
            <button
              className="px-4 py-2 rounded-md border border-red-600 text-red-600 
                         hover:bg-red-50 dark:hover:bg-red-900"
              onClick={handleDelete}
            >
              Hapus
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              className="px-4 py-2 rounded-md border text-gray-600 
                         hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 
                         dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
  
}
