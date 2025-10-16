"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartCardProps {
  title: string;
  data: { name: string; value: number }[];
  total: number;
}

export function PieCart({ title, data, total }: ChartCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const series = data.length ? data.map((item) => item.value) : [0];
  const labels = data.length ? data.map((item) => item.name) : ["No Data"];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels,
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => (total ?? 0).toLocaleString(),
            },
          },
        },
      },
    },
    colors: ["#6A5ACD", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"],
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#999",
        fontSize: "14px",
      },
    },
  };

  if (!mounted) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-white/[0.05]">
        <h3 className="text-base font-medium mb-4 dark:text-gray-400">{title}</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.05]">
      <h3 className="text-base font-medium mb-4 dark:text-gray-400">{title}</h3>
      <ApexChart options={options} series={series} type="donut" height={300} />
    </div>
  );
}
