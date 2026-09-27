import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Check, ChevronRight, LockKeyhole, ReceiptText, Sparkles, WalletCards } from "lucide-react";

const features = [
  { icon: BarChart3, title: "See the whole picture", text: "Understand balances, income, expenses and account activity from one calm dashboard." },
  { icon: ReceiptText, title: "Capture transactions faster", text: "Record income and expenses quickly, with receipt scanning available when you need it." },
  { icon: BrainCircuit, title: "AI-assisted insights", text: "Use your financial activity as context for smarter categorization and useful summaries." },
  { icon: WalletCards, title: "Multiple accounts", text: "Keep current and savings accounts together while maintaining a clear default account." },
];
const steps = [
  ["01", "Create your account", "Sign up securely and start with an empty, private workspace."],
  ["02", "Add your money", "Create accounts and enter balances so your dashboard reflects reality."],
  ["03", "Track and improve", "Add transactions, set a budget, and use the data to understand your habits."],
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-white text-slate-950">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,.16),transparent_48%)] sm:h-[720px]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:gap-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-28">
          <div>
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm"><Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-600" /> <span>Personal finance, redesigned</span></div>
            <h1 className="max-w-4xl text-[2.65rem] font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">Your money.<span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Clearer than ever.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-xl sm:leading-8">Welth brings accounts, transactions, budgets and AI-assisted financial tools into one focused workspace built for everyday decisions.</p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link href="/sign-up" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800 sm:w-auto">Start for free <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/sign-in" className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto">I already have an account</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 sm:mt-8 sm:text-sm">{["Private workspace", "PostgreSQL-backed data", "Secure Clerk authentication"].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-600" />{item}</span>)}</div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-100 via-indigo-50 to-violet-100 blur-2xl sm:-inset-6 sm:rounded-[2.5rem]" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 p-2.5 shadow-2xl shadow-slate-900/15 sm:rounded-[2rem] sm:p-3">
              <div className="rounded-[1.15rem] bg-white p-4 sm:rounded-[1.4rem] sm:p-6">
                <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400 sm:text-xs">Overview</p><p className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Good morning</p></div><div className="rounded-xl bg-slate-100 p-2"><BarChart3 className="h-5 w-5 text-slate-700" /></div></div>
                <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-4 text-white sm:mt-6 sm:p-5"><p className="text-xs font-medium text-slate-400">Example balance</p><p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">₹ 84,250</p><div className="mt-5 h-16 rounded-xl bg-white/5 p-2.5 sm:mt-6 sm:h-20 sm:p-3"><div className="flex h-full items-end gap-1.5 sm:gap-2">{[25,38,31,55,47,68,60,82,73,91].map((height, i) => <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-cyan-300" style={{height: height + "%"}} />)}</div></div></div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3"><div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4"><p className="text-[10px] text-slate-400 sm:text-xs">Example income</p><p className="mt-1 text-sm font-bold text-emerald-600 sm:text-base">₹ 52,800</p></div><div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4"><p className="text-[10px] text-slate-400 sm:text-xs">Example expenses</p><p className="mt-1 text-sm font-bold text-rose-600 sm:text-base">₹ 18,420</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="border-y border-slate-100 bg-slate-50/70 py-16 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600 sm:text-sm">Everything in one place</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">A finance workspace that stays out of your way.</h2></div><div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2">{features.map(({icon: Icon, title, text}) => <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></div><h3 className="mt-5 text-lg font-extrabold sm:mt-6 sm:text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 sm:leading-7">{text}</p><Link href="/sign-up" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900 sm:mt-5">Explore <ChevronRight className="h-4 w-4" /></Link></div>)}</div></div></section>
      <section id="workflow" className="py-16 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 sm:gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600 sm:text-sm">Simple workflow</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Start simple. Build clarity over time.</h2><p className="mt-4 text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">No spreadsheets to maintain and no complicated setup. Your financial workspace grows with the data you add.</p></div><div className="space-y-3 sm:space-y-4">{steps.map(([number,title,text]) => <div key={number} className="grid gap-3 rounded-3xl border border-slate-200 p-5 sm:grid-cols-[70px_1fr] sm:items-center sm:p-6"><span className="text-3xl font-black tracking-tight text-slate-200 sm:text-4xl">{number}</span><div><h3 className="text-base font-extrabold sm:text-lg">{title}</h3><p className="mt-1 text-sm text-slate-600 sm:text-base">{text}</p></div></div>)}</div></div></div></section>
      <section id="security" className="bg-slate-950 py-16 text-white sm:py-20"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div className="max-w-2xl"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-blue-300 sm:text-sm"><LockKeyhole className="h-4 w-4" /> Built with security in mind</div><h2 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">Your finance data belongs in your workspace.</h2><p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">Authentication is handled by Clerk and application data is persisted through Prisma and PostgreSQL. Production secrets stay in Vercel environment variables.</p></div><Link href="/sign-up" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 sm:w-auto">Create your workspace <ArrowRight className="h-4 w-4" /></Link></div></section>
      <footer className="border-t border-slate-200 bg-white py-7"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>© {new Date().getFullYear()} Welth. Personal finance, made clear.</p><div className="flex gap-5"><Link href="/sign-in" className="hover:text-slate-900">Sign in</Link><Link href="/sign-up" className="hover:text-slate-900">Sign up</Link></div></div></footer>
    </div>
  );
}