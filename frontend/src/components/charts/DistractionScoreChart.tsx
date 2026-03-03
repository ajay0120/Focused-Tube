import { useMemo } from "react";
import type { ChartConfiguration } from "chart.js";
import BaseChart from "./BaseChart";

interface DistractionData {
  date: string;
  distractionScore: number;
}

const DistractionScoreChart = ({ data }: { data: DistractionData[] }) => {
  const config = useMemo<ChartConfiguration>(() => ({
    type: "line",
    data: {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: "Distraction Score",
          data: data.map(item => item.distractionScore),
          borderColor: "rgba(239,68,68,1)", // red-500
          backgroundColor: "rgba(239,68,68,0.15)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "rgba(239,68,68,1)",
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

export default DistractionScoreChart;