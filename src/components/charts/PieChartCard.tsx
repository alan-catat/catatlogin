"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartCard } from "./ChartCard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  const labels = data.map((d) => d.name);
  const series = data.map((d) => d.value);

  const options: ApexOptions = {
    chart: { type: "pie" },
    labels,
    legend: { position: "bottom" },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    colors: ["#3B82F6", "#22C55E", "#F97316", "#EAB308", "#EC4899"],
  };

  return (
    <ChartCard title={title}>
      <ReactApexChart options={options} series={series} type="pie" height={310} />
    </ChartCard>
  );
}
