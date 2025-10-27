"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/auth/sign-in");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">
        Selamat datang, {user.firstName} 👋
      </h1>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}
