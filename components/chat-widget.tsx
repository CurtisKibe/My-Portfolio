"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "bot"; text: string };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Welcome To Curtis's Portfolio. Hi! I'm Aqie, Curtis's personal AI Agent. I'm trained on his career. Ask me anything about him from his Python projects to his leadership style!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || "Sorry, I couldn't think of an answer." }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "bot", text: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-125 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">AI</div>
              <div>
                <p className="font-bold text-sm">Curtis&apos;s Agent</p>
                <p className="text-xs text-gray-400">Ask me anything</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "bot" && (
                   <div className="w-6 h-6 bg-orange-500 rounded-full shrink-0 mt-1 flex items-center justify-center text-xs text-white font-bold">AI</div>
                )}
                <div className={`p-3 rounded-lg text-sm shadow-sm max-w-[85%] ${
                  m.role === "user" 
                    ? "bg-gray-900 text-white rounded-tr-none" 
                    : "bg-white border border-gray-200 text-gray-700 rounded-tl-none prose prose-sm"
                }`}>
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full shrink-0 mt-1 flex items-center justify-center text-xs text-white font-bold">AI</div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none text-sm text-gray-700 shadow-sm flex items-center gap-1">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }} 
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 text-gray-900"
                placeholder="Type a question..."
              />
              <button type="submit" className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-900 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="hidden group-hover:inline font-medium pr-2">Chat with Aqie</span>
        </button>
      )}
    </div>
  );
}