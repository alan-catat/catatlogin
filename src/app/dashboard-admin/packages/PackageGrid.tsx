"use client";

import { useRouter } from "next/navigation";

interface Package {
  id: string;
  name: string | null;
  is_paid: boolean | null;
  price: number | null;
  token_limit: number | null;
  included_channels: string[] | null;
  created_at: string | null;
}

interface PackageGridProps {
  packages: Package[];
}

export default function PackageGrid({ packages }: PackageGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          onClick={() => router.push(`/dashboard-admin/packages/${pkg.id}`)}
          className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 
                     shadow-sm transition hover:shadow-md 
                     dark:border-gray-700 dark:bg-white/[0.05]"
        >
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            {pkg.name}
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            {pkg.is_paid ? `Berbayar - Rp ${pkg.price}` : "Gratis"}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Token Limit: {pkg.token_limit}
          </p>
        </div>
      ))}
    </div>
  );

}
