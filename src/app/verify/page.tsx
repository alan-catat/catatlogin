"use client";

import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Memuat halaman verifikasi...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
