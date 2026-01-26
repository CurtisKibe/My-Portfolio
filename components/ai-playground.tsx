"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2, Send, User, Bot, RefreshCcw, ArrowRight } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIPlayground() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isActive = messages.length > 0;

  useEffect(() => {
    if (isActive && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, isActive]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput(""); 

    // 1. Adds User Message to the History 
    const newHistory: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      // 2. Sends the FULL history to the backend so it "remembers" context
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.content || data.error || "Server error");
      }

      // 3. Adds the AI's reply to the History
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Connection failed";
      setMessages((prev) => [...prev, { role: "assistant", content: `### ⚠️ Error\n\n${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <section id="playground" className="py-20 bg-linear-to-br from-stone-50 to-orange-50/30 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className={`text-center transition-all duration-500 ${isActive ? "mb-6" : "mb-10"}`}>
          <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Product/Strategy Validator</h2>
          <p className="mt-2 text-gray-600">
            {isActive 
              ? "Strategy session in progress. I will remember context as we refine the idea." 
              : "Pitch your idea or strategy and my AI Agent will audit it and generate a technical feasibility check and a growth strategy for you."}
          </p>
        </div>

        {/* --- VIEW 1: IDLE STATE (Simple Input Box) --- */}
        {!isActive && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What are you building?
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 text-base"
              placeholder="e.g., An AI-powered logistics platform for rural farmers in Kenya..."
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
              >
                Start Analysis <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 2: ACTIVE STATE (Full Chat Interface) --- */}
        {isActive && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col h-150 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Chat History Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50 scroll-smooth"
            >
              {/* MAPPING THROUGH HISTORY */}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    m.role === "user" ? "bg-gray-900 text-white" : "bg-blue-400 text-white"
                  }`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-gray-900 text-white rounded-tr-none" 
                      : "bg-white border border-gray-200 text-gray-700 rounded-tl-none prose prose-sm max-w-none"
                  }`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* Loading Spinner */}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Analyzing...</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <button 
                  onClick={resetSession}
                  title="Reset Session"
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                  placeholder="Type your reply..."
                />
                
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-gray-900 text-white p-3 rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">
                The AI remembers context. Reply to its questions to deepen the analysis.
              </p>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}