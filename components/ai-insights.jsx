"use client";

import { useState } from "react";
import { Bot, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import { askFinancialAdvisor } from "@/actions/ai";

const suggestions = [
  "Where am I spending the most?",
  "How can I reduce my monthly expenses?",
  "What is my current cash flow?",
  "Am I within my monthly budget?",
  "Show me my recurring expenses.",
  "What should I focus on financially?",
];

export function AiInsights() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(value = question) {
    const text = value.trim();
    if (!text || loading) return;

    setQuestion("");
    setError("");
    setMessages((current) => [...current, { role: "user", content: text }]);
    setLoading(true);

    try {
      const answer = await askFinancialAdvisor(text);
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch (err) {
      setError(err?.message || "Unable to answer your finance question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-950">Welth Finance AI</h2>
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                Finance only
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Ask questions about your Welth accounts, transactions, spending, budgets, cash flow and recurring expenses.
              Answers are based on your recorded finance data.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[520px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">Ask me about your money</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                I can analyze your recorded financial data and explain spending, budgets, cash flow,
                balances and recurring payments.
              </p>
              <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAsk(suggestion)}
                    disabled={loading}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
                      message.role === "user"
                        ? "rounded-br-md bg-slate-950 text-white"
                        : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <UserRound className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing your finance data...
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-6">
            {error}
          </div>
        )}

        <div className="border-t border-slate-200 bg-slate-50/80 p-4 sm:p-5">
          <div className="flex gap-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleAsk();
                }
              }}
              placeholder="Ask a finance question..."
              maxLength={1500}
              disabled={loading}
              className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-indigo-600 px-4 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Ask finance AI"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Finance questions only • Uses your recorded Welth data • AI can make mistakes
          </p>
        </div>
      </div>
    </section>
  );
}
