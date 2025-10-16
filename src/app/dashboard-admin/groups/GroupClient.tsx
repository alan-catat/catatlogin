'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import GroupGrid from "./groupGrid";
import { useAlert } from "@/components/ui/alert/Alert";

const ModalGroup = dynamic(() => import("./modalGroup"), { ssr: false });

interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default  function GroupClient() {
  const [dataGroups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const { setAlertData } = useAlert();

  const supabase = createClient();


  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("groups")
      .select("id, name, description, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Gagal mengambil data groups:", error.message);
      setGroups([]);
    } else {
      setGroups(data || []);
    }
    setLoading(false);
  };
  useEffect(() => {
    const init = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }
  
      await fetchGroups();
    };
  
    init();
  }, []);
  

  const handleSave = async (group: Partial<Group>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (group.id) {
        // UPDATE GROUP
        const { error } = await supabase
          .from("groups")
          .update({
            name: group.name,
            description: group.description,
          })
          .eq("id", group.id);

        if (error) {
          setAlertData({
            variant: "error",
            title: "Gagal Menyimpan",
            message: error.message,
          });
          return;
        }

        setAlertData({
          variant: "success",
          title: "Berhasil",
          message: "Group berhasil diperbarui.",
        });
        fetchGroups();
      } else {
        // INSERT GROUP
        const { data: newGroup, error: groupError } = await supabase
          .from("groups")
          .insert({
            name: group.name,
            description: group.description,
            user_id: user.id,
          })
          .select("id, name")
          .single();

        if (groupError) {
          setAlertData({
            variant: "error",
            title: "Gagal Menyimpan",
            message: groupError.message,
          });
          return;
        }


        setAlertData({
          variant: "success",
          title: "Berhasil",
          message: "Group berhasil dibuat.",
        });
        fetchGroups();
      }


    } catch (err: any) {
      setAlertData({
        variant: "error",
        title: "Error",
        message: err.message || "Terjadi kesalahan",
      });
    }
  };


  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("groups").delete().eq("id", id);

    if (error) {
      setAlertData({
        variant: "error",
        title: "Gagal Menghapus",
        message: error.message,
      });
      return;
    }
    setAlertData({
      variant: "success",
      title: "Berhasil",
      message: "Group berhasil dihapus.",
    });
    fetchGroups();

  };

  if (loading) {
    return <div className="text-center mt-10">Memuat data...</div>;
  }

  if (!loggedIn) {
    return (
      <div className="text-center text-red-500 mt-10">
        Anda belum login atau sesi sudah berakhir.
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Daftar Groups
          </h3>
          <button
            onClick={() => {
              setSelectedGroup(null);
              setModalOpen(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Tambah Group
          </button>
        </div>

        <GroupGrid
          groups={dataGroups}
          onCardClick={(group) => {
            setSelectedGroup(group);
            setModalOpen(true);
          }}
        />
      </div>

      <ModalGroup
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedGroup}
        onSubmit={handleSave}
        onDelete={handleDelete}
        fetchGroups={fetchGroups}
      />
    </div>
  );
}
