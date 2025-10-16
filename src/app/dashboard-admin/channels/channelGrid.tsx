"use client";

import React from "react";

interface Channel {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface ChannelGridProps {
  channels: Channel[];
  onCardClick: (channel: Channel) => void;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels && channels.length > 0 ? (
        channels.map((channel) => {
          const name = channel.name?.toLowerCase();
          const iconFile =
            name === "telegram"
              ? "telegram.png"
              : name === "whatsapp"
              ? "whatsapp.png"
              : "internet.png";

          const iconPath = `/images/brand/${iconFile}`;

          return (
            <div
              key={channel.id}
              className="cursor-pointer rounded-xl border border-gray-200 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.05]"
              onClick={() => onCardClick(channel)}
            >
              <div
                className="h-20 w-20 rounded-full bg-center bg-cover bg-no-repeat mx-auto mb-4"
                style={{
                  backgroundImage: `url(${iconPath})`,
                }}
              />
              <h4 className="text-center font-semibold text-gray-800 dark:text-white">
                {channel.name || "Tanpa Nama"}
              </h4>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Status:{" "}
                <span
                  className={`font-medium ${
                    channel.is_active ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {channel.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </p>
              <p className="text-center text-xs text-gray-400 mt-2">
                Dibuat pada: {new Date(channel.created_at!).toLocaleDateString()}
              </p>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center text-gray-500">
          Tidak ada channel ditemukan.
        </div>
      )}
    </div>
  );
};

export default ChannelGrid;
