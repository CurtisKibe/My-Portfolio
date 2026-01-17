"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// 1. Define the allowed types strictly
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
    company: "HumAInity Labs",
    date: "Nov 2025 – Present",
    type: "tech",
    desc: "Leading a 5-person team building AI solutions.",
    details: [
      "Architected backend logic for 'MediGrid' (Health) and 'EcoLoom' (Agri) using Python.",
      "Reduced admin overhead by ~40% via custom AI agents.",
      "Designed value-driven pitch decks for 'BimaSync'.",
    ],
    color: "bg-orange-500",
  },
  {
    id: "exp2",
    role: "Data Content Strategist",
    company: "Her Data Project",
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
    company: "Africa for SDGs",
    date: "Sept 2020 – Nov 2023",
    type: "ops",
    desc: "Logistics at scale for community programs.",
    details: [
      "Directed logistics for 17 annual community programs.",
      "Managed sensitive client records with 100% compliance with the DPA (HIPAA/GDPR Equivalent).",
    ],
    color: "bg-red-500",
  },
];

export default function Experience() {
  // 2. Apply the specific type to the state
  const [filter, setFilter] = useState<FilterType>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredData = EXPERIENCE_DATA.filter(
    (item) => filter === "all" || item.type === filter
  );

  // 3. Define the buttons with the strict type
  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tech", label: "Tech & Product" },
    { key: "ops", label: "Operations" },
  ];

  return (
    <section id="experience" className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Career Trajectory</h2>
          <div className="flex justify-center mt-6 space-x-2">
            {filterOptions.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)} // No longer needs 'as any'
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

        <div className="relative space-y-8 pl-8 sm:pl-0">
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 -z-10"></div>
          
          {filteredData.map((item, idx) => (
            <div
              key={item.id}
              className={`relative sm:flex sm:justify-between sm:items-center ${
                idx % 2 !== 0 ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow ${item.color}`}></div>

              <div className={`sm:w-[45%] mb-4 sm:mb-0 ${idx % 2 !== 0 ? "pl-8" : "sm:text-right pr-8"}`}>
                <h3 className="text-lg font-bold text-gray-900">{item.role}</h3>
                <p className={`${item.type === 'tech' ? 'text-orange-600' : 'text-gray-600'} font-medium`}>{item.company}</p>
                <p className={`${item.type === 'ops' ? 'text-blue-500': 'text-gray-600'} font-medium`}>{item.company}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>

              <div className={`sm:w-[45%] ${idx % 2 !== 0 ? "sm:text-right pr-8" : "pl-8"}`}>
                <div
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  className={`bg-white p-5 rounded-lg shadow-sm border border-stone-200 hover:border-orange-300 transition cursor-pointer text-left`}
                >
                  <p className="text-sm text-gray-700 font-medium mb-2">{item.desc}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    {expanded === item.id ? "Show less" : "Click for impact details"} 
                    {expanded === item.id ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                  </p>
                  
                  {expanded === item.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 space-y-2 animate-in fade-in">
                      {item.details.map((d, i) => (
                        <p key={i}>• {d}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}