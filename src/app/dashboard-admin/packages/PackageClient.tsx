"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import PackageGrid from "./PackageGrid";
import dynamic from "next/dynamic";

const ModalPackage = dynamic(() => import("./modalPackage"), { ssr: false });

interface Package {
  id: string;
  name: string | null;
  is_paid: boolean | null;
  price: number | null;
  token_limit: number | null;
  included_channels: string[] | null;
  created_at: string | null;
}

interface Channel {
  id: string;
  name: string;
}

export default function PackageClient() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPackages();
    fetchChannels();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil packages:", error.message);
    } else {
      setPackages(data || []);
    }
  };

  const fetchChannels = async () => {
    const { data, error } = await supabase.from("channels").select("id,name").eq("is_active", true);
    if (error) {
      console.error("Gagal mengambil channels:", error.message);
    } else {
      setChannels(data || []);
    }
  };



  const handleSave = async (pkg: Partial<Package>) => {
    if (!pkg.included_channels || pkg.included_channels.length === 0) {
      console.warn("Tidak ada channel dipilih");
      return;
    }

    // 🔎 Ambil channel names berdasarkan id
    const { data: selectedChannels, error: chError } = await supabase
      .from("channels")
      .select("id, name")
      .in("id", pkg.included_channels); // filter id yang dipilih

    if (chError) {
      console.error("Gagal ambil channel:", chError.message);
      return;
    }

    // 🔄 Ubah id[] → name[]
    const channelNames = selectedChannels?.map((ch) => ch.name) ?? [];

    if (pkg.id) {
      // Edit
      const { error } = await supabase
        .from("packages")
        .update({
          name: pkg.name,
          is_paid: pkg.is_paid,
          price: pkg.price,
          token_limit: pkg.token_limit,
          included_channels: channelNames, // ✅ simpan name
          updated_at: new Date().toISOString(),
        })
        .eq("id", pkg.id);

      if (error) console.error("Gagal update:", error.message);
    } else {
      // Tambah
      const { error } = await supabase.from("packages").insert({
        name: pkg.name,
        is_paid: pkg.is_paid,
        price: pkg.price,
        token_limit: pkg.token_limit,
        included_channels: channelNames, // ✅ simpan name
      });

      if (error) console.error("Gagal tambah:", error.message);
    }

    await fetchPackages();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) {
      console.error("Gagal delete:", error.message);
    }
    await fetchPackages();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Daftar Packages
        </h3>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                     transition dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={() => {
            setSelectedPackage(null);
            setModalOpen(true);
          }}
        >
          + Tambah Paket
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm 
                      dark:border-gray-800 dark:bg-gray-900 p-4">
        <PackageGrid packages={packages} />
      </div>

      <ModalPackage
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedPackage}
        onSubmit={handleSave}
        onDelete={handleDelete}
        channels={channels} // ✅ kirim channels ke modal
      />
    </div>
  );

}
