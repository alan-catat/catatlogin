"use client";

import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading callback...</div>}>
      <CallbackClient />
    </Suspense>
  );
}
