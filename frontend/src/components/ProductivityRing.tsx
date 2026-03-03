import React, { useEffect, useState } from "react";

interface Props {
  percentage: number; // 0 to 100
}

const ProductivityRing: React.FC<Props> = ({ percentage }) => {
  const [progress, setProgress] = useState(0);

  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= percentage) {
        start = percentage;
        clearInterval(interval);
      }
      setProgress(start);
    }, 15);

    return () => clearInterval(interval);
  }, [percentage]);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#10b981"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>

      <div className="absolute text-2xl font-bold text-emerald-600">
        {progress.toFixed(0)}%
      </div>
    </div>
  );
};

export default ProductivityRing;