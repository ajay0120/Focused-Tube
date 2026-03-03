import { useMemo } from "react";
import type { ChartConfiguration } from "chart.js";
import BaseChart from "./BaseChart";

interface ChartDataItem {
  date: string;
  count: number;
}

const OverridesChart = ({ data }: { data: ChartDataItem[] }) => {
  const config = useMemo<ChartConfiguration>(() => ({
    type: "line",
    data: {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: "Overrides Per Day",
          data: data.map(item => item.count),
          borderColor: "rgba(59,130,246,1)", // blue-500
          backgroundColor: "rgba(59,130,246,0.15)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "rgba(59,130,246,1)",
          pointBorderWidth: 2,
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

export default OverridesChart;