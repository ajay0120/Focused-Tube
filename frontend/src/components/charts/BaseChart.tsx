import { useEffect, useRef } from "react";
import { Chart, type ChartConfiguration } from "chart.js/auto";

interface Props {
  config: ChartConfiguration;
}

const BaseChart = ({ config }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [config]);

  return (
    <div className="relative h-80">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BaseChart;