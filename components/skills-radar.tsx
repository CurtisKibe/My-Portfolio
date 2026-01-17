"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SkillsRadar() {
  const data = {
    labels: [
      "Python/AI Dev",
      "Automation",
      "Product Strategy",
      "Data Storytelling",
      "Team Leadership",
      "Systems Eng.",
    ],
    datasets: [
      {
        label: "Skill Proficiency",
        data: [90, 85, 80, 75, 85, 70],
        backgroundColor: "rgba(234, 88, 12, 0.2)",
        borderColor: "rgb(234, 88, 12)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(234, 88, 12)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(234, 88, 12)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: "#E5E7EB" },
        grid: { color: "#E5E7EB" },
        pointLabels: {
          font: { size: 12, family: "'Inter', sans-serif", weight: "bold" as const }, // Fixed TS type
          color: "#374151",
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      <Radar data={data} options={options} />
    </div>
  );
}