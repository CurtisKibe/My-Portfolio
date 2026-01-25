"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterType = "all" | "tech" | "ops";

type ExpItem = {
  id: string;
  role: string;
  company: string;
  date: string;
  type: "tech" | "ops";
  desc: string;
  details: string[];
  color: string;
};

const EXPERIENCE_DATA: ExpItem[] = [
  {
    id: "exp1",
    role: "Founding Engineer & Tech Lead",
    company: "HumAInity Labs (Hybrid)",
    date: "Sept 2025 – Present",
    type: "tech",
    desc: "Leading a 5-person team building AI solutions.",
    details: [
      "Architected backend logic for 'MediGrid' (Health) and 'AgriGuard' (Agri) using Python.",
      "Reduced admin overhead by ~40% via custom AI agents.",
      "Designed value-driven pitch decks for 'DairyLink' and 'BimaSync'.",
    ],
    color: "bg-orange-500",
  },
  {
    id: "exp2",
    role: "Data Content Strategist",
    company: "Her Data Project (Remote)",
    date: "Nov 2025 – Present",
    type: "tech",
    desc: "Bridging raw analytics and public engagement.",
    details: [
      "Analyzing complex emerging data trends and engineering papers.",
      "Creating accessible, viral educational content for technical audiences.",
    ],
    color: "bg-blue-500",
  },
  {
    id: "exp3",
    role: "Executive Operations Partner",
    company: "Urban Alive (Remote)",
    date: "Aug 2023 – Oct 2025",
    type: "ops",
    desc: "High-level operational support and data intelligence.",
    details: [
      "Synthesized market data for 20+ funding proposals.",
      "Managed executive logistics and 'Inbox Zero' efficiency.",
    ],
    color: "bg-gray-400",
  },
  {
    id: "exp4",
    role: "Program Coordinator",
    company: "Africa for SDGs (Hybrid)",
    date: "Sept 2020 – Nov 2023",
    type: "ops",
    desc: "Logistics at scale for community programs.",
    details: [
      "Directed logistics for 17 annual community programs.",
      "Managed sensitive client records with 100% compliance with the DPA.",
    ],
    color: "bg-red-500",
  },
];

export default function Experience() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredData = EXPERIENCE_DATA.filter(
    (item) => filter === "all" || item.type === filter
  );

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tech", label: "Tech & Product" },
    { key: "ops", label: "Operations" },
  ];

  const ExperienceCard = ({ item, isRight = false }: { item: ExpItem; isRight?: boolean }) => (
    <div className={`relative flex items-center w-full ${isRight ? "text-left" : "text-left sm:text-right"}`}>
      
      {/* 1. The Content Box */}
      <div className={`flex-1 ${isRight ? "pl-0" : "pr-0"}`}>
        <h3 className="text-lg font-bold text-gray-900">{item.role}</h3>
        <p className={`font-semibold ${item.type === 'tech' ? 'text-orange-600' : 'text-blue-500'}`}>
          {item.company}
        </p>
        <p className="text-xs text-gray-500 font-mono mt-1 mb-2">{item.date}</p>

        <div
          onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          className={`bg-white p-4 rounded-lg shadow-sm border border-stone-200 hover:border-orange-300 transition cursor-pointer text-left inline-block w-full`}
        >
          <p className="text-sm text-gray-700 font-medium mb-1">{item.desc}</p>
          <div className={`flex items-center gap-1 text-xs text-gray-400 ${!isRight ? "sm:justify-end" : ""}`}>
            <span>{expanded === item.id ? "Close" : "Details"}</span>
            {expanded === item.id ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
          </div>
          {expanded === item.id && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 space-y-2 animate-in fade-in text-left">
              {item.details.map((d, i) => <p key={i}>• {d}</p>)}
            </div>
          )}
        </div>
      </div>

      {/* 2. The Dot */}
      <div 
        className={`hidden sm:block absolute top-6 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${item.color}
        ${isRight ? "-left-10.5" : "-right-10.5"} 
        `}
      ></div>
    </div>
  );

  return (
    <section id="experience" className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Career Trajectory</h2>
          <div className="flex justify-center mt-6 space-x-2">
            {filterOptions.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === btn.key
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- MOBILE LAYOUT --- */}
        <div className="block sm:hidden space-y-8 pl-4 border-l border-gray-300 ml-4">
          {filteredData.map((item) => (
            <div key={item.id} className="relative pl-6">
              <div className={`absolute top-2 -left-5.25 w-3 h-3 rounded-full border-2 border-white shadow-sm ${item.color}`}></div>
              <ExperienceCard item={item} isRight={true} />
            </div>
          ))}
        </div>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden sm:block relative">
          
          {/* THE CENTER LINE */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-300"></div>

          <div className="flex justify-between w-full">
            
            {/* LEFT COLUMN */}
            <div className="w-[45%] flex flex-col gap-y-24"> 
              {filteredData.filter((_, i) => i % 2 === 0).map((item) => (
                <ExperienceCard key={item.id} item={item} isRight={false} />
              ))}
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-[45%] flex flex-col gap-y-24 pt-12"> 
              {filteredData.filter((_, i) => i % 2 !== 0).map((item) => (
                <ExperienceCard key={item.id} item={item} isRight={true} />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}