"use client";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Category {
  id: string;
  name: string;
  group: {
    id: string;
    name: string;
  };
}

interface CashFlow {
  id: string;
  flow_items: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  flow_transaction_date: string;
  flow_qty: number;
  flow_unit: string;
  flow_merchant: string;
  category: Category;
}

interface StatisticsChartProps {
  cashFlows: CashFlow[];
}

const ChartTab: React.FC<{
  selected: "daily" | "weekly" | "monthly";
  onChange: (value: "daily" | "weekly" | "monthly") => void;
}> = ({ selected, onChange }) => {
  const getButtonClass = (option: "daily" | "weekly" | "monthly") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange("daily")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "daily"
        )}`}
      >
        Harian
      </button>
      <button
        onClick={() => onChange("weekly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "weekly"
        )}`}
      >
        Mingguan
      </button>
      <button
        onClick={() => onChange("monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        Bulanan
      </button>
    </div>
  );
};

export default function StatisticsChart({ cashFlows }: StatisticsChartProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const { categories, incomeData, expenseData } = useMemo(() => {
    const now = new Date();
    let categories: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    if (period === "daily") {
      categories = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
      });
      incomeData = Array(7).fill(0);
      expenseData = Array(7).fill(0);

      cashFlows.forEach(flow => {
        const date = new Date(flow.flow_transaction_date);
        const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 7) {
          const idx = 6 - diff;
          if (flow.flow_type === "income") incomeData[idx] += flow.flow_amount;
          else expenseData[idx] += flow.flow_amount;
        }
      });
    }

    if (period === "weekly") {
      categories = Array.from({ length: 4 }).map((_, i) => `Minggu-${4 - i}`);
      incomeData = Array(4).fill(0);
      expenseData = Array(4).fill(0);

      cashFlows.forEach(flow => {
        const date = new Date(flow.flow_transaction_date);
        const weekDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 7));
        if (weekDiff < 4) {
          const idx = 3 - weekDiff;
          if (flow.flow_type === "income") incomeData[idx] += flow.flow_amount;
          else expenseData[idx] += flow.flow_amount;
        }
      });
    }

    if (period === "monthly") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      categories = Array.from({ length: 12 }).map((_, i) => {
        const d = new Date();
        d.setMonth(now.getMonth() - (11 - i));
        return monthNames[d.getMonth()];
      });
      incomeData = Array(12).fill(0);
      expenseData = Array(12).fill(0);

      cashFlows.forEach(flow => {
        const date = new Date(flow.flow_transaction_date);
        const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        if (monthDiff < 12) {
          const idx = 11 - monthDiff;
          if (flow.flow_type === "income") incomeData[idx] += flow.flow_amount;
          else expenseData[idx] += flow.flow_amount;
        }
      });
    }

    return { categories, incomeData, expenseData };
  }, [cashFlows, period]);

  const options: ApexOptions = {
    legend: { show: true, position: "top", horizontalAlign: "left" },
    colors: ["#465FFF", "#9CB9FF"],
    chart: { fontFamily: "Outfit, sans-serif", height: 310, type: "line", toolbar: { show: false } },
    stroke: { curve: "straight", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: { type: "category", categories, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] } }, title: { text: "", style: { fontSize: "0px" } } },
  };

  const series = [
    { name: "Income", data: incomeData },
    { name: "Expense", data: expenseData },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target Anda untuk periode {period}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab selected={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
