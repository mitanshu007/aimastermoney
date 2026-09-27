export const dynamic = "force-dynamic";

import Link from "next/link";
import { BarChart3, Home, Plus, ArrowLeft, WalletCards } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/transaction", label: "Transactions", icon: BarChart3 },
  { href: "/account", label: "Accounts", icon: WalletCards },
];

export default function MainLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-slate-200 bg-white/80 px-4 py-6 lg:block">
          <div className="mb-7 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex items-center gap-2"><WalletCards className="h-5 w-5 text-blue-300" /><span className="font-black tracking-tight">Welth Workspace</span></div>
            <p className="mt-2 text-xs leading-5 text-slate-400">Track your money without the spreadsheet clutter.</p>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"><Icon className="h-4 w-4" /> {label}</Link>
            ))}
            <Link href="/transaction/create" className="mt-3 flex items-center gap-3 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"><Plus className="h-4 w-4" /> Add transaction</Link>
          </nav>
          <div className="pt-10"><Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to website</Link></div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
