"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2, Send, User, Bot, RefreshCcw } from "lucide-react";

// Define the structure of a chat message
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIPlayground() {
  const [input, setInput] = useState("");
  
  // This array stores the ENTIRE conversation history
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever a new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput(""); // Clear input immediately

    // 1. Add User Message to the History (Display it immediately)
    const newHistory: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      // 2. Send the FULL history to the backend so it "remembers" context
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.content || data.error || "Server error");
      }

      // 3. Add the AI's reply to the History
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
    <section id="playground" className="py-16 bg-linear-to-br from-stone-50 to-orange-50/30 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Product/Strategy Validator</h2>
          <p className="mt-2 text-gray-600">
            Pitch your idea or strategy and my AI Agent will audit it and generate a feasibility check and a growth strategy for you.
          </p>
        </div>

        {/* Chat Interface Container - Fixed Height for Scrolling */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col h-150">
          
          {/* Chat History Area - This is where the scrolling happens */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-sm font-medium text-gray-500">Ready to validate your concept?</p>
                <p className="text-xs mt-2">Example: &quot;I want to build an Uber for tractors in rural Kenya...&quot;</p>
                <p className="text-xs mt-2">Or</p>
                <p className="text-xs mt-2">Example: &quot;A mobile app that connects local farmers directly with restaurants...&quot;</p>
              </div>
            )}

            {/* MAPPING THROUGH HISTORY: This renders ALL replies */}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === "user" ? "bg-gray-900 text-white" : "bg-orange-600 text-white"
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
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shrink-0 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">Analyzing...</span>
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
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
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                placeholder="Type your pitch or reply..."
              />
              
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">
              The AI remembers context. Reply to its questions to deepen the analysis.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}