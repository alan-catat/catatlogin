"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";

interface Channel {
  id: string;
  name: string;
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onDelete?: (id: string) => void;
  channels?: Channel[]; // ✅ daftar channel dari supabase
  initialData?: {
    id: string;
    name: string | null;
    is_paid: boolean | null;
    price: number | null;
    token_limit: number | null;
    included_channels: string[] | null;
  } | null;
}

export default function ModalPackage({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  channels = [],
}: PackageModalProps) {
  const [name, setName] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [tokenLimit, setTokenLimit] = useState(0);
  const [includedChannels, setIncludedChannels] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setIsPaid(initialData.is_paid ?? false);
      setPrice(initialData.price ?? 0);
      setTokenLimit(initialData.token_limit ?? 0);
      setIncludedChannels(initialData.included_channels ?? []);
    } else {
      setName("");
      setIsPaid(false);
      setPrice(0);
      setTokenLimit(0);
      setIncludedChannels([]);
    }
  }, [initialData]);

  const handleToggleChannel = (id: string) => {
    if (includedChannels.includes(id)) {
      setIncludedChannels(includedChannels.filter((c) => c !== id));
    } else {
      setIncludedChannels([...includedChannels, id]);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Nama paket tidak boleh kosong.");
      return;
    }

    onSubmit?.({
      id: initialData?.id,
      name,
      is_paid: isPaid,
      price,
      token_limit: tokenLimit,
      included_channels: includedChannels, // ✅ simpan channel
    });

    onClose();
  };

  const handleDelete = () => {
    if (initialData?.id && confirm("Yakin ingin menghapus paket ini?")) {
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
        {initialData ? "Edit Paket" : "Tambah Paket"}
      </h2>
  
      <div className="space-y-4">
        {/* Nama Paket */}
        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">
            Nama Paket
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
  
        {/* Berbayar */}
        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">Berbayar?</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 
                       bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={isPaid ? "1" : "0"}
            onChange={(e) => setIsPaid(e.target.value === "1")}
          >
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
        </div>
  
        {/* Harga */}
        {isPaid && (
          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">Harga</label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 p-2 
                         bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>
        )}
  
        {/* Batas Token */}
        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">
            Batas Token
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-gray-300 p-2 
                       bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tokenLimit}
            onChange={(e) => setTokenLimit(parseInt(e.target.value))}
          />
        </div>
  
        {/* Checklist Channels */}
        <div>
          <label className="block text-sm mb-2 dark:text-gray-300">
            Channels
          </label>
          <div className="space-y-2">
            {channels.map((ch) => (
              <label
                key={ch.id}
                className="flex items-center gap-2 dark:text-gray-200"
              >
                <input
                  type="checkbox"
                  checked={includedChannels.includes(ch.id)}
                  onChange={() => handleToggleChannel(ch.id)}
                />
                {ch.name}
              </label>
            ))}
          </div>
        </div>
  
        {/* Tombol Aksi */}
        <div className="flex justify-between items-center pt-4">
          {initialData?.id && (
            <button
              className="border border-red-600 text-red-600 px-4 py-2 rounded 
                         hover:bg-red-50 dark:hover:bg-red-900"
              onClick={handleDelete}
            >
              Hapus
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100 
                         dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 
                         focus:ring-2 focus:ring-blue-500"
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
