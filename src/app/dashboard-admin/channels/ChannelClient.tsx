"use client";


import { useEffect, useState } from "react";
import ChannelGrid from "./channelGrid";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";

const ModalChannel = dynamic(() => import("./modalChannel"), { ssr: false });

interface Channel {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
}


export default function ChannelClient() {
    const [dataChannels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const supabase = createClient();

    // Ambil data saat mount
    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        const { data, error } = await supabase
            .from("channels")
            .select("id, name, is_active, created_at")
            .is("deleted_at", null)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Gagal mengambil data channels:", error.message);
            return;
        }

        setChannels(data || []);
    };

    const handleSave = async (channel: Partial<Channel>) => {
        if (channel.id) {
            // Edit channel
            const { error } = await supabase
                .from("channels")
                .update({ name: channel.name, is_active: channel.is_active })
                .eq("id", channel.id);

            if (error) {
                console.error("Gagal mengedit channel:", error.message);
                return;
            }
        } else {
            // Tambah channel
            const { error } = await supabase.from("channels").insert({
                name: channel.name,
                is_active: channel.is_active,
            });

            if (error) {
                console.error("Gagal menambah channel:", error.message);
                return;
            }
        }

        await fetchChannels();
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("channels").delete().eq("id", id);

        if (error) {
            console.error("Gagal menghapus channel:", error.message);
            return;
        }

        await fetchChannels();
    };

    const handleAddClick = () => {
        setSelectedChannel(null);
        setModalOpen(true);
    };

    const handleCardClick = (channel: Channel) => {
        setSelectedChannel(channel);
        setModalOpen(true);
    };

    return (
        <div>

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Daftar Channels</h3>
                    <button
                        onClick={() => {
                            setSelectedChannel(null); // untuk tambah baru
                            setModalOpen(true);
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Tambah Channel
                    </button>
                </div>

                <ChannelGrid
                    channels={dataChannels}
                    onCardClick={(channel) => {
                        setSelectedChannel(channel);
                        setModalOpen(true);
                    }}
                />
            </div>

            <ModalChannel
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={selectedChannel}
                onSubmit={handleSave}
                onDelete={handleDelete}
            />

        </div>
    );
}
