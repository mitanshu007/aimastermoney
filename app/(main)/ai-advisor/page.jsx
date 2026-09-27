import { Bot, ShieldCheck } from "lucide-react";
import { AiInsights } from "@/components/ai-insights";

export const dynamic = "force-dynamic";

export default function AiAdvisorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
          <Bot className="h-4 w-4" />
          Welth AI
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Finance AI Chat</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Your finance-only AI assistant. Ask about your balances, transactions, spending,
          budgets, cash flow and recurring expenses.
        </p>
      </div>

      <AiInsights />

      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          Welth AI provides general financial information from your recorded data. It is not a
          licensed Chartered Accountant, tax professional, investment adviser or lawyer.
        </span>
      </div>
    </div>
  );
}
