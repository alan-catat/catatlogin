"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [progress, setProgress] = useState(0);

  // === Simulasi animasi progress bar ===
  useEffect(() => {
    if (status === "loading") {
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + Math.random() * 10 : p));
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  // === Verifikasi token ===
  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("failed");
      setTimeout(() => router.replace("/auth/dashboard-user/signup"), 4000);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_N8N_VERIFY_URL as string, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Response not OK");
        const data = await res.json();

        if (data.status === "success") {
          setStatus("success");
          setTimeout(() => router.replace("/dashboard-user"), 3000);
        } else {
          setStatus("failed");
          setTimeout(() => router.replace("/auth/dashboard-user/signup"), 4000);
        }
      } catch (err) {
        console.error("Error verifikasi:", err);
        setStatus("failed");
        setTimeout(() => router.replace("/auth/dashboard-user/signup"), 4000);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-50">
      {/* === Progress bar di atas === */}
      <div
        className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
        style={{ width: `${progress}%`, opacity: progress === 0 ? 0 : 1 }}
      ></div>

      <div className="text-center px-6">
        {status === "loading" && (
          <>
            <p className="text-lg font-semibold text-gray-700">Memverifikasi token...</p>
            <div className="animate-pulse mt-2 text-sm text-gray-500">Tunggu sebentar</div>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-lg font-semibold text-green-600">✅ Verifikasi berhasil!</p>
            <div className="mt-2 text-sm text-gray-500">Mengalihkan ke dashboard...</div>
          </>
        )}

        {status === "failed" && (
          <>
            <p className="text-lg font-semibold text-red-600">
              ❌ Token tidak valid atau sudah kadaluarsa.
            </p>
            <div className="mt-2 text-sm text-gray-500">Mengalihkan ke halaman signup...</div>
          </>
        )}
      </div>
    </main>
  );
}
