"use client";

import { useState } from "react";
import {
  Sparkles, Loader2, Lightbulb, ArrowRight, MessageCircle,
  ShieldCheck, Send, AlertTriangle,
} from "lucide-react";
import { generateFinancialInsights, askFinancialAdvisor } from "@/actions/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const suggestions = [
  "Where am I spending the most?",
  "Can I reduce my monthly expenses?",
  "How much did I save from my recorded income?",
  "Review my budget and tell me what needs attention.",
];

export function AiInsights() {
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      setResult(await generateFinancialInsights());
    } catch (err) {
      setError(err?.message || "Unable to generate your finance review.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk(value = question) {
    const text = value.trim();
    if (!text) return;
    setChatLoading(true);
    setError("");
    setQuestion(text);
    try {
      setAnswer(await askFinancialAdvisor(text));
    } catch (err) {
      setError(err?.message || "Unable to answer your finance question.");
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <Card className="mt-6 overflow-hidden rounded-3xl border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 shadow-sm">
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-indigo-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold">Welth AI Financial Advisor</span>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight">Your CA-style finance assistant.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ask about spending, cash flow, budgets, recurring payments and your recorded finances.
              I&apos;ll calculate from your Welth data and explain it in plain English.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="shrink-0 rounded-xl bg-slate-950 hover:bg-slate-800">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Reviewing..." : result ? "Refresh review" : "Review my finances"}
          </Button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-4">
          <div className="flex items-center gap-2 text-slate-900">
            <MessageCircle className="h-4 w-4 text-indigo-600" />
            <p className="font-bold">Ask your finance advisor</p>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") handleAsk(); }}
              placeholder="e.g. Where am I overspending?"
              maxLength={1500}
              className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <Button onClick={() => handleAsk()} disabled={chatLoading || !question.trim()} className="min-h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700">
              {chatLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Ask
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => handleAsk(suggestion)} disabled={chatLoading}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50">
                {suggestion}
              </button>
            ))}
          </div>
          {answer && (
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Welth AI</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{answer}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        {result && !error && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-3">
              <p className="text-sm font-semibold text-slate-500">Advisor summary</p>
              <p className="mt-1 font-bold text-slate-900">{result.summary}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-slate-900"><Lightbulb className="h-4 w-4 text-amber-500" /><p className="font-bold">What I noticed</p></div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.insights.map((item, i) => <li key={i} className="flex gap-2"><span className="text-indigo-500">•</span><span>{item}</span></li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-slate-900"><ArrowRight className="h-4 w-4 text-blue-600" /><p className="font-bold">Next actions</p></div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.actions.map((item, i) => <li key={i} className="flex gap-2"><span className="text-blue-500">•</span><span>{item}</span></li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="flex items-center gap-2 text-slate-900"><AlertTriangle className="h-4 w-4 text-amber-600" /><p className="font-bold">Watchouts</p></div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {(result.watchouts || []).map((item, i) => <li key={i} className="flex gap-2"><span className="text-amber-600">•</span><span>{item}</span></li>)}
                {!result.watchouts?.length && <li className="text-slate-500">No specific watchouts from the available data.</li>}
              </ul>
            </div>
            <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs leading-5 text-slate-500 lg:col-span-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Welth AI is an AI finance assistant, not a licensed Chartered Accountant or investment/tax professional.
                For important tax filings, legal matters, or investment decisions, verify the final decision with a qualified professional.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
