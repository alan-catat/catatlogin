"use client";

import React from "react";

interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface GroupGridProps {
  groups: Group[];
  onCardClick: (group: Group) => void;
}

const GroupGrid: React.FC<GroupGridProps> = ({ groups, onCardClick }) => {
  // Daftar gambar carousel
  const carouselImages = [
    "/images/carousel/carousel-01.png",
    "/images/carousel/carousel-02.png",
    "/images/carousel/carousel-03.png",
    "/images/carousel/carousel-04.png",
  ];

  // Fungsi ambil gambar random
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * carouselImages.length);
    return carouselImages[randomIndex];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups && groups.length > 0 ? (
        groups.map((group) => {
          const imagePath = getRandomImage();

          return (
            <div
              key={group.id}
              className="cursor-pointer rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.05] overflow-hidden"
              onClick={() => onCardClick(group)}
            >
              {/* Gambar header */}
              <div
                className="h-40 bg-center bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url(${imagePath})`,
                }}
              />
              {/* Konten */}
              <div className="p-4">
                <h4 className="text-center font-semibold text-gray-800 dark:text-white">
                  {group.name || "Tanpa Nama"}
                </h4>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {group.description || "Tidak ada deskripsi"}
                </p>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Dibuat pada:{" "}
                  {group.created_at
                    ? new Date(group.created_at).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center text-gray-500">
          Tidak ada group ditemukan.
        </div>
      )}
    </div>
  );
};

export default GroupGrid;
