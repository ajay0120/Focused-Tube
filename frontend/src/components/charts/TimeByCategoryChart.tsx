import { useMemo } from "react";
import type { ChartConfiguration } from "chart.js";
import BaseChart from "./BaseChart";

interface ChartItem {
  category: string;
  totalWatchTime: number;
}

const TimeByCategoryChart = ({ data }: { data: ChartItem[] }) => {
  const config = useMemo<ChartConfiguration>(() => ({
    type: "bar",
    data: {
      labels: data.map(item => item.category),
      datasets: [
        {
          label: "Total Watch Time",
          data: data.map(item => item.totalWatchTime),
          backgroundColor: "rgba(16,185,129,0.6)", // emerald-500
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#374151",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#6B7280" },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
        y: {
          ticks: { color: "#6B7280" },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
    },
  }), [data]);

  return <BaseChart config={config} />;
};

export default TimeByCategoryChart;