"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ENVIRONMENT_SYSTEM, brandColors } from "@/constants/test-data";
<<<<<<< HEAD
=======
import SignUpForm from "@/components/auth/SignUpForm";
>>>>>>> 0c999da (update fitur dashboard user)

// --- Types ---
type BillingPlan = {
  id: string;
  package_id: string;
  name: string;
  billing_cycle: "monthly" | "annually";
  price: number;
  token_limit: number;
  duration_days: number;
  is_active: boolean;
  features: string[];
};

type Package = {
  id: string;
  name: string;
  price: number;
  included_channels: string[];
  token_limit: number;
  is_paid: boolean;
  billing_plans: BillingPlan[];
};

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulasi fetch data (contoh)
  useEffect(() => {
    setTimeout(() => {
      const sampleData: Package[] = [
        {
          id: "1",
          name: "Free",
          price: 0,
          included_channels: ["WhatsApp", "Telegram"],
          token_limit: 1000,
          is_paid: false,
          billing_plans: [
            {
              id: "1m",
              package_id: "1",
              name: "Free",
              billing_cycle: "monthly",
              price: 0,
              token_limit: 1000,
              duration_days: 30,
              is_active: true,
              features: ["Catat transaksi", "Laporan dasar", "Sinkronisasi cloud"],
            },
            {
              id: "1y",
              package_id: "1",
              name: "Free",
              billing_cycle: "annually",
              price: 0,
              token_limit: 1000,
              duration_days: 365,
              is_active: true,
              features: ["Catat transaksi", "Laporan dasar", "Sinkronisasi cloud"],
            },
          ],
        },
        {
          id: "2",
          name: "Pro",
          price: 59000,
          included_channels: ["WhatsApp", "Telegram", "Google Sheet"],
          token_limit: 10000,
          is_paid: true,
          billing_plans: [
            {
              id: "2m",
              package_id: "2",
              name: "Pro",
              billing_cycle: "monthly",
              price: 59000,
              token_limit: 10000,
              duration_days: 30,
              is_active: true,
              features: [
                "Semua fitur Free",
                "Grafik keuangan otomatis",
                "Prioritas dukungan pelanggan",
                "Integrasi dengan GSheet",
              ],
            },
            {
              id: "2y",
              package_id: "2",
              name: "Pro",
              billing_cycle: "annually",
              price: 590000,
              token_limit: 10000,
              duration_days: 365,
              is_active: true,
              features: [
                "Semua fitur Free",
                "Grafik keuangan otomatis",
                "Prioritas dukungan pelanggan",
                "Integrasi dengan GSheet",
              ],
            },
          ],
        },
        {
          id: "3",
          name: "Business",
          price: 149000,
          included_channels: ["WhatsApp", "Telegram", "Google Sheet", "API Access"],
          token_limit: 50000,
          is_paid: true,
          billing_plans: [
            {
              id: "3m",
              package_id: "3",
              name: "Business",
              billing_cycle: "monthly",
              price: 149000,
              token_limit: 50000,
              duration_days: 30,
              is_active: true,
              features: [
                "Semua fitur Pro",
                "Akses multi-user",
                "Ekspor laporan PDF",
                "Integrasi API bisnis",
              ],
            },
            {
              id: "3y",
              package_id: "3",
              name: "Business",
              billing_cycle: "annually",
              price: 1490000,
              token_limit: 50000,
              duration_days: 365,
              is_active: true,
              features: [
                "Semua fitur Pro",
                "Akses multi-user",
                "Ekspor laporan PDF",
                "Integrasi API bisnis",
              ],
            },
          ],
        },
      ];
      setPackages(sampleData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
         <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
            {ENVIRONMENT_SYSTEM.appName}
          </h1>
          <Link
            href="/auth/dashboard-user/signin"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Login
          </Link>
<<<<<<< HEAD
        </div>
      </header>

=======
           <Link
          href="/auth/dashboard-user/signup"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#05668D] text-white font-medium shadow-sm hover:bg-[#04506c] hover:scale-105 active:scale-95 transition"
        >
          Daftar
        </Link>
        </div>
      </header>
       
>>>>>>> 0c999da (update fitur dashboard user)
      {/* Hero / Intro */}
      <section className="flex flex-col items-center text-center mt-12 px-6">
        <h2 className="text-4xl font-extrabold mb-4">
          Kelola Keuangan Jadi Lebih Mudah 💰
        </h2>
        <p className="text-gray-600 max-w-2xl mb-8">
          Catat transaksi, pantau arus kas, dan dapatkan insight otomatis. Pilih paket sesuai kebutuhan Anda.
        </p>

        {/* Toggle Monthly / Annually */}
        <div className="flex items-center justify-center space-x-2 bg-gray-200 rounded-full p-1 mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${billingCycle === "monthly"
              ? "bg-white shadow text-black"
              : "text-gray-600"
              }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${billingCycle === "annually"
              ? "bg-white shadow text-black"
              : "text-gray-600"
              }`}
          >
            Tahunan
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <main className="flex-1">
        <div id="pricing" className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto w-full px-6 mb-16">
{packages.map((pkg, index) => {
  const plan = pkg.billing_plans.find(
    (bp) => bp.billing_cycle === billingCycle
  );
  if (!plan) return null;

  return (
    <div
      key={pkg.id}
      style={{
        transitionDelay: `${index * 100}ms`, // delay animasi antar kartu
      }}
      className={`relative border rounded-2xl p-6 flex flex-col shadow-sm transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl
        ${pkg.name === "Pro" ? "bg-gray-900 text-white" : "bg-white"}
      `}
    >
      {pkg.name === "Pro" && (
        <span className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
          Paling Populer
        </span>
      )}

      <h3 className="text-xl font-semibold">{pkg.name}</h3>
      <p
        className={`mt-1 text-sm ${pkg.name === "Pro" ? "text-gray-300" : "text-gray-500"
          }`}
      >
        {pkg.name === "Free"
          ? "Cocok untuk pencatatan pribadi"
          : pkg.name === "Pro"
            ? "Untuk pengguna aktif dan bisnis kecil"
            : "Untuk tim dan usaha skala besar"}
      </p>

      <div className="flex items-baseline mt-4">
        <span className="text-3xl font-bold">
          Rp{plan.price.toLocaleString("id-ID")}
        </span>
        <span className="ml-1 text-sm">
          /{billingCycle === "monthly" ? "bulan" : "tahun"}
        </span>
      </div>

      {/* Included Channels */}
      <ul className="flex gap-2 mt-3 flex-wrap">
        {pkg.included_channels.map((ch, idx) => (
          <li
            key={idx}
            className="px-2 py-1 text-xs bg-gray-200 rounded-full text-gray-700"
          >
            {ch}
          </li>
        ))}
      </ul>

      {/* Features */}
      <ul
        className={`mt-6 space-y-2 text-sm flex-1 ${pkg.name === "Pro" ? "" : "text-gray-700"
          }`}
      >
        {plan.features.map((f, i) => (
          <li key={i}>✓ {f}</li>
        ))}
      </ul>

      <Link
        href={`/subscription?plan=${pkg.name.toLowerCase()}`}
        className={`mt-6 w-full py-2 rounded-lg font-medium text-center block ${pkg.name === "Pro"
          ? "bg-indigo-500 hover:bg-indigo-600 text-white"
          : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
      >
        Mulai {pkg.name}
      </Link>
    </div>
  );
})}

        </div>

        {/* Feature Comparison Table */}
        <section className="max-w-5xl mx-auto w-full px-6 mb-20 overflow-x-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Bandingkan Paket Kami
          </h3>
          <table className="min-w-full border border-gray-200 text-sm text-left rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Fitur</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-3 border text-center font-semibold">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(
                new Set(
                  packages.flatMap((pkg) =>
                    pkg.billing_plans
                      .find((bp) => bp.billing_cycle === billingCycle)
                      ?.features || []
                  )
                )
              ).map((feature, idx) => (
                <tr
                  key={idx}
                  className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                >
                  <td className="p-3 border">{feature}</td>
                  {packages.map((pkg) => {
                    const plan = pkg.billing_plans.find(
                      (bp) => bp.billing_cycle === billingCycle
                    );
                    const hasFeature = plan?.features.includes(feature);
                    return (
                      <td key={pkg.id} className="p-3 border text-center">
                        {hasFeature ? "✅" : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
