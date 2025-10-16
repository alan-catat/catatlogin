"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";

  const supabase = createClient();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("Session error:", error?.message);
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("error");
      }
    };

    handleCallback();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      {status === "loading" && <p className="text-gray-600">Memverifikasi akun Anda...</p>}

      {status === "success" && (
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">✅ Akun berhasil diaktivasi!</h1>
          <p className="text-gray-500 mb-6">
            Klik tombol di bawah untuk melanjutkan ke pembayaran.
          </p>
          <Link
            href={`/subscription?plan=${plan}&step=1`}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Lanjut ke Pembayaran →
          </Link>
        </div>
      )}

      {status === "error" && (
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Aktivasi gagal</h1>
          <p className="text-gray-500">Silakan coba login kembali atau cek link aktivasi Anda.</p>
        </div>
      )}
    </div>
  );
}
