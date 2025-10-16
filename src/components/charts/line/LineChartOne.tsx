"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartCard } from "../ChartCard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LineChartCardProps {
  title: string;
  data: { date: string; total: number }[];
}

export function LineChartCard({ title, data }: LineChartCardProps) {
  const categories = data.map((d) => d.date);
  const seriesData = data.map((d) => d.total);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 310,
      toolbar: { show: true }, // bisa scroll & zoom
      zoom: { enabled: true },
    },
    stroke: { curve: "straight", width: 2 },
    colors: ["#465FFF"],
    markers: { size: 4 },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    tooltip: { x: { format: "yyyy-MM-dd" } },
    xaxis: {
      categories,
      labels: { rotate: -45 },
    },
  };

  const series = [{ name: "Transactions", data: seriesData }];

  return (
    <ChartCard title={title}>
      <ReactApexChart options={options} series={series} type="line" height={310} />
    </ChartCard>
  );
}
