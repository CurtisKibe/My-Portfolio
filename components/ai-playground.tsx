"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2 } from "lucide-react"; // Icons

export default function AIPlayground() {
  const [idea, setIdea] = useState("");
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setStrategy("");

    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (data.strategy) {
        setStrategy(data.strategy);
      }
    } catch (err) {
      console.error(err);
      setStrategy("Error: Could not reach the AI brain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" className="py-16 bg-linear-to-br from-stone-50 to-orange-50/30 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Product/Strategy Validator</h2>
          <p className="mt-2 text-gray-600">
            Enter a startup idea, and my AI Agent will generate a technical feasibility check and growth strategy for you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 sm:p-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Startup / Project Idea</label>
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none text-gray-900"
              placeholder="e.g., A mobile app that connects local farmers directly with restaurants..."
            />
            <button
              onClick={generateStrategy}
              disabled={loading || !idea}
              className="absolute bottom-3 right-3 bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span>Analyzing...</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {strategy && (
            <div className="mt-6 bg-stone-50 rounded-lg p-5 border border-stone-200 prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{strategy}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}