"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SubscriptionData {
  packageName: string;
  billingPlanName: string;
  startDate: string;
  endDate: string;
}

export default function Subscription({ userId }: { userId: string }) {
  const supabase = createClient();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        // 1️⃣ Ambil seluruh user subscriptions dulu
        const { data: subscriptions, error: subError } = await supabase
          .from("user_subscriptions")
          .select("id, start_date, end_date, payment_id")
          .order("start_date", { ascending: false });

        if (subError) {
          console.error("Error fetching subscriptions:", subError);
          return;
        }

        if (!subscriptions || subscriptions.length === 0) {
          console.log("Tidak ada user subscriptions");
          return;
        }

        // 2️⃣ Ambil payment dari subscriptions yang memiliki user_id
        let subscriptionFound = null;

        for (const sub of subscriptions) {
          const { data: payment, error: payError } = await supabase
            .from("payments")
            .select("id, user_id, transaction_id")
            .eq("id", sub.payment_id)
            .maybeSingle();

          if (payError) {
            console.error("Error fetching payment:", payError);
            continue;
          }

          if (!payment || payment.user_id !== userId) {
            continue;
          }

          // Payment cocok, simpan subscription ini
          subscriptionFound = { subscription: sub, payment };
          break;
        }

        if (!subscriptionFound) {
          console.log("User subscription tidak ditemukan");
          return;
        }

        const { subscription, payment } = subscriptionFound;

        // 3️⃣ Ambil transaction
        const { data: transaction, error: tranError } = await supabase
          .from("transactions")
          .select("id, billing_plan_id")
          .eq("id", payment.transaction_id)
          .maybeSingle();

        if (tranError || !transaction) {
          console.log("Transaction tidak ditemukan");
          console.log(tranError);
          return;
        }

        // 4️⃣ Ambil billing plan
        const { data: billingPlan, error: bpError } = await supabase
          .from("billing_plans")
          .select("id, name, package_id")
          .eq("id", transaction.billing_plan_id)
          .maybeSingle();

        if (bpError || !billingPlan) {
          console.log("Billing plan tidak ditemukan");
          return;
        }

        // 5️⃣ Ambil package
        const { data: packageData, error: pkgError } = await supabase
          .from("packages")
          .select("id, name")
          .eq("id", billingPlan.package_id)
          .maybeSingle();

        if (pkgError || !packageData) {
          console.log("Package tidak ditemukan");
          return;
        }

        // ✅ Semua data lengkap, set subscription
        setSubscription({
          packageName: packageData.name,
          billingPlanName: billingPlan.name,
          startDate: subscription.start_date,
          endDate: subscription.end_date,
        });

      } catch (err) {
        console.error("Unexpected error fetching subscription:", err);
      }
    }

    fetchSubscription();
  }, [userId, supabase]);


  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: { fontFamily: "Outfit, sans-serif", type: "radialBar", height: 330, sparkline: { enabled: true } },
    plotOptions: { radialBar: { startAngle: -85, endAngle: 85, hollow: { size: "80%" }, track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 }, dataLabels: { name: { show: false }, value: { fontSize: "36px", fontWeight: "600", offsetY: -40, color: "#1D2939", formatter: (val) => val + "%" } } } },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown() { setIsOpen(false); }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Status Langganan</h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">Informasi paket dan masa aktif akun kamu</p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem tag="a" onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                Detail Langganan
              </DropdownItem>
              <DropdownItem tag="a" onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                Batalkan
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            Sisa Token
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {subscription
            ? <>Kamu menggunakan paket <strong>{subscription.billingPlanName} - {subscription.packageName}</strong>. Langganan berlaku hingga <strong>{new Date(subscription.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</strong>.</>
            : "Loading data langganan..."}
        </p>
      </div>



      {subscription && (
        <div className="flex flex-col items-center gap-4 px-6 py-3.5 sm:gap-6 sm:py-5">
          {/* Row 1: Paket */}
          <div className="flex items-center justify-center gap-5 sm:gap-8">
            <div>
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Paket</p>
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {subscription.billingPlanName} - {subscription.packageName}
              </p>
            </div>
          </div>

          {/* Row 2: Tanggal mulai dan berakhir */}
          <div className="flex items-center justify-center gap-5 sm:gap-8">
            <div>
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Mulai</p>
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {new Date(subscription.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
            <div>
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Berakhir</p>
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {new Date(subscription.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
