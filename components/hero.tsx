"use client";

import { useState } from "react";
import { MessageSquare, Mail } from "lucide-react";
import ContactModal from "./contact-modal";

export default function Hero() {
  const [isContactOpen, setIsContactOpen] = useState(false);


  const FORMSPREE_ID = "xeeeevqv";

  return (
    <>
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        formId={FORMSPREE_ID} 
      />

      {/* Hero Header */}
      <header id="hero" className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            AI Engineer <span className="text-orange-600">&</span> Product Lead
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A &quot;T-Shaped&quot; Founder transforming raw code into market value. Combining{" "}
            <span className="font-semibold text-gray-800">Python Engineering</span> with{" "}
            <span className="font-semibold text-gray-800">Growth Strategy</span> to build scalable solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Python / Pandas", "AI Agents & LLMs", "CyberSecurity", "Growth Strategy", "Aeronautical Eng."].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm font-medium border border-stone-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Contact Me
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("open-chat"))} // <--- The Magic Trigger
              className="px-6 py-3 bg-white text-orange-600 border border-orange-200 font-semibold rounded-lg hover:bg-orange-50 transition flex items-center gap-2"
            >
              Try My AI Assistant <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Impact Stats */}
      <section className="py-12 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: "40%", label: "Overhead Reduction", sub: "via AI Automation", color: "text-orange-600" },
              { val: "5", label: "Team Size Lead", sub: "Engineers & Creatives", color: "text-gray-900" },
              { val: "20+", label: "Funding Proposals", sub: "Data-Backed Research", color: "text-gray-900" },
              { val: "100%", label: "Compliance Rate", sub: "Data Governance", color: "text-gray-900" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-stone-100 hover:-translate-y-1 transition duration-300">
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.val}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
