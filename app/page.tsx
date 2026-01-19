"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import SkillsRadar from "@/components/skills-radar";
import Experience from "@/components/experience";
import AIPlayground from "@/components/ai-playground";
import ChatWidget from "@/components/chat-widget";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-gray-900">CURTIS KIBE</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex space-x-8 items-center">
              {["Hero", "Skills", "Experience", "Projects"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())} 
                  className="text-gray-500 hover:text-orange-600 px-3 py-2 text-sm font-medium transition"
                >
                  {item === "Hero" ? "Profile" : item}
                </button>
              ))}
              <button onClick={() => scrollTo("playground")} className="text-orange-600 font-bold px-3 py-2 text-sm flex items-center gap-1">
                AI Demo 
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 p-2">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Hero", "Skills", "Experience", "Projects", "Playground"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Components */}
      <Hero />

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Technical Arsenal</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              A balanced skill set bridging the gap between <span className="font-semibold text-orange-600">technical execution</span> and <span className="font-semibold text-orange-600">product viability</span>.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               {/* Skill Lists */}
               <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 border-l-4 border-orange-500 pl-3">Core Engineering</h3>
                  <p className="text-gray-600">Building robust backend logic and AI agents. Experienced in automating workflows.</p>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 border-l-4 border-blue-500 pl-3">Product & Growth</h3>
                  <p className="text-gray-600">Translating technical data into compelling narratives. Driving lead generation.</p>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 border-l-4 border-emerald-500 pl-3">Operations</h3>
                  <p className="text-gray-600">Managing distributed teams and ensuring project delivery.</p>
               </div>
            </div>
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <SkillsRadar />
            </div>
          </div>
        </div>
      </section>

      <Experience />

      {/* Projects Section (Static Inline) */}
      <section id="projects" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Deployments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="group flex flex-col bg-stone-50 border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">🤖</div>
                  <span className="text-xs font-mono bg-gray-800 text-white px-2 py-1 rounded">v1.0</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Email Bot</h3>
                <p className="text-sm text-gray-600">Python-based agent utilizing OpenAI API to personalize and automate email replies.</p>
              </div>
            </div>
             {/* Project 2 */}
             <div className="group flex flex-col bg-stone-50 border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">🏠</div>
                  <span className="text-xs font-mono bg-gray-800 text-white px-2 py-1 rounded">Data</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real Estate Scraper</h3>
                <p className="text-sm text-gray-600">Extracting and analyzing property pricing trends from Redfin to identify arbitrage.</p>
              </div>
            </div>
             {/* Project 3 */}
             <div className="group flex flex-col bg-stone-50 border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">📧</div>
                  <span className="text-xs font-mono bg-gray-800 text-white px-2 py-1 rounded">NLP</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Support Bot</h3>
                <p className="text-sm text-gray-600">Support Agent utilizing Gemini API to personalize and automate customer service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIPlayground />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Education</h3>
            <p className="text-white font-semibold">B.Sc. Aeronautical Engineering</p>
            <p className="text-sm text-gray-400">Kenya Aeronautical College | 2022</p>
            <p className="text-xs text-gray-500 mt-2">Focus Areas: Avionics, Systems Engineering & Fluid Dynamics</p>
          </div>
          <div className="text-right flex flex-col items-start md:items-end">
             <h3 className="text-white text-lg font-bold mb-4">Connect</h3>
             
             {/* 1. Email */}
             <a 
               href="mailto:kibecurtis@gmail.com" 
               className="flex items-center gap-2 hover:text-orange-400 transition"
             >
               <Mail size={16}/> kibecurtis@gmail.com
             </a>

             {/* 2. LinkedIn */}
             <a 
               href="https://www.linkedin.com/in/curtiskibe" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="flex items-center gap-2 hover:text-white transition mt-2"
             >
               <Linkedin size={16}/> LinkedIn Profile
             </a>

             {/* 3. GitHub */}
             <a 
               href="https://github.com/CurtisKibe" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="flex items-center gap-2 hover:text-white transition mt-2"
             >
               <Github size={16}/> GitHub Portfolio
             </a>
             
             <p className="text-xs text-gray-600 mt-6">&copy; 2025 Curtis Kibe. Engineered with Next.js.</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </main>
  );
}