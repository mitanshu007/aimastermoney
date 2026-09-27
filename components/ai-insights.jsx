"use client";

import { useState } from "react";
import { Sparkles, Loader2, Lightbulb, ArrowRight } from "lucide-react";
import { generateFinancialInsights } from "@/actions/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AiInsights() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      setResult(await generateFinancialInsights());
    } catch (err) {
      setError(err?.message || "Unable to generate AI insights.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-6 overflow-hidden rounded-3xl border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-700">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold">Welth AI</span>
            </div>
            <h2 className="mt-3 text-xl font-black tracking-tight">Understand your money with AI.</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Get a plain-English summary of your recent spending patterns and practical next steps.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="shrink-0 rounded-xl bg-slate-950 hover:bg-slate-800">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Analyzing..." : result ? "Refresh insights" : "Analyze my finances"}
          </Button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        {result && !error && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-3">
              <p className="text-sm font-semibold text-slate-500">AI summary</p>
              <p className="mt-1 font-bold text-slate-900">{result.summary}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-slate-900"><Lightbulb className="h-4 w-4 text-amber-500" /><p className="font-bold">What I noticed</p></div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.insights.map((item, i) => <li key={i} className="flex gap-2"><span className="text-indigo-500">•</span><span>{item}</span></li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2">
              <div className="flex items-center gap-2 text-slate-900"><ArrowRight className="h-4 w-4 text-blue-600" /><p className="font-bold">Suggested next steps</p></div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.actions.map((item, i) => <li key={i} className="flex gap-2"><span className="text-blue-500">•</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
