"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutDashboard, Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-950 shadow-sm">
            <Image src="/log1.png" alt="Welth" width={36} height={36} className="object-contain" priority />
          </div>
          <div><span className="block text-base font-black tracking-tight text-slate-950">WELTH</span><span className="hidden text-[9px] font-semibold uppercase tracking-[.22em] text-slate-400 sm:block">Money, made clear</span></div>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <Link href="/#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Features</Link>
          <Link href="/#workflow" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">How it works</Link>
          <Link href="/#security" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Security</Link>
        </div>
        <div className="flex items-center gap-2">
          <SignedOut>
            <Link href="/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">Sign in</Link>
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">Get started <ArrowRight className="h-4 w-4" /></Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
            <Link href="/transaction/create" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"><Plus className="h-4 w-4" /> <span className="hidden sm:inline">Transaction</span></Link>
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
