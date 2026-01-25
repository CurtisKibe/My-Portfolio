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
      "Cybersecurity",
      "Systems Eng.",
      "Automation",
      "Team Leadership",
      "Product Strategy",
      "Data Storytelling",
    ],
    datasets: [
      {
        label: "Skill Proficiency",
        data: [90, 70, 75, 85, 90, 70,80],
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
          font: { size: 12, family: "'Inter', sans-serif", weight: "bold" as const }, 
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
    <div className="w-full h-75 sm:h-87.5">
      <Radar data={data} options={options} />
    </div>
  );
}