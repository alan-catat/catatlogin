"use client";

import { Suspense } from "react";
import SubscriptionPageClient from "./SubscriptionPageClient";

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SubscriptionPageClient />
    </Suspense>
  );
}
