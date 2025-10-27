"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ambil data user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // kalau belum login, arahkan ke halaman sign-in
      router.push("/auth/sign-in");
    }
    setLoading(false);
  }, [router]);

  return { user, loading };
}
