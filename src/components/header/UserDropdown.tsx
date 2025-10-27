"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
}

export default function UserDropdown() {
  const [user, setUser] = useState<User | null>(null);

  // Ambil user dari localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Ambil inisial dari firstname + lastname
  const getInitials = (firstname?: string, lastname?: string) => {
    const first = firstname?.charAt(0)?.toUpperCase() ?? "";
    const last = lastname?.charAt(0)?.toUpperCase() ?? "";
    return (first + last) || "U";
  };

  // URL avatar otomatis (kalau belum ada)
  const avatarUrl = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
          "User"
      )}&background=random&color=fff&bold=true`;

 
  const handleSignOut = () => {
  // Hapus semua data user di localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token"); // kalau kamu simpan token n8n juga

  // Redirect ke halaman login
  window.location.href = "/auth/dashboard-user/signin"; // atau "/login", sesuaikan
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 focus:outline-none">
          {/* Avatar */}
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white font-semibold">
            {user?.avatar ? (
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={44}
                height={44}
                className="object-cover rounded-full"
              />
            ) : (
              <span>{getInitials(user?.firstName, user?.lastName)}</span>
            )}
          </div>

          {/* Info singkat */}
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-semibold">
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "User Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {user?.email ?? "No email"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled>
          <div className="flex items-center gap-2">
            <UserIcon size={16} />
            <span>
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "User"}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut size={16} className="mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
