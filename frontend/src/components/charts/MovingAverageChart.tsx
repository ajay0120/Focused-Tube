import { Line } from "react-chartjs-2";
import { useMemo } from "react";

const MovingAverageChart = ({ labels, data }: { labels: string[], data: number[] }) => {

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "3-Day Moving Average",
        data,
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
      },
    ],
  }), [labels, data]);

  return <Line data={chartData} />;
};

export default MovingAverageChart;