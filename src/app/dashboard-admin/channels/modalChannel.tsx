"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onDelete?: (id: string) => void;
  initialData?: {
    id: string;
    name: string;
    is_active: boolean;
  } | null;
}

export default function ModalChannel({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}: ChannelModalProps) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIsActive(initialData.is_active ?? true);
    } else {
      setName("");
      setIsActive(true);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Nama channel tidak boleh kosong.");
      return;
    }

    onSubmit?.({ id: initialData?.id, name, is_active: isActive });
    onClose();
  };

  const handleDelete = () => {
    if (initialData?.id && confirm("Yakin ingin menghapus channel ini?")) {
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
        {initialData ? "Edit Channel" : "Tambah Channel"}
      </h2>
  
      <div className="space-y-4">
        {/* Nama Channel */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Nama Channel
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
  
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Status
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 
                       bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={isActive ? "1" : "0"}
            onChange={(e) => setIsActive(e.target.value === "1")}
          >
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>
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
              className="px-4 py-2 rounded-md bg-blue-600 text-white 
                         hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
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
