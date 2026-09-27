import { AiInsights } from "@/components/ai-insights";

export const dynamic = "force-dynamic";

export default function AiAdvisorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-indigo-600">Welth AI</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">AI Financial Advisor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          A CA-style assistant for your recorded finances, budgets, cash flow and spending patterns.
        </p>
      </div>
      <AiInsights />
    </div>
  );
}
