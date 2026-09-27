"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutDashboard, Menu, Plus, X } from "lucide-react";
import { useState } from "react";

const mobileLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#workflow", label: "How it works" },
  { href: "/#security", label: "Security" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)} className="group flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950 shadow-sm">
            <Image src="/log1.png" alt="Welth" width={36} height={36} className="object-contain" priority />
          </div>
          <div className="min-w-0">
            <span className="block text-base font-black tracking-tight text-slate-950">WELTH</span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[.22em] text-slate-400 sm:block">Money, made clear</span>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {mobileLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <SignedOut>
            <Link href="/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">Sign in</Link>
            <Link href="/sign-up" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:px-4">
              <span>Get started</span><ArrowRight className="h-4 w-4" />
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/transaction/create" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-3.5">
              <Plus className="h-4 w-4" /><span className="hidden xs:inline sm:inline">Transaction</span>
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </SignedIn>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="space-y-1">
            {mobileLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{link.label}</Link>
            ))}
            <SignedOut>
              <Link href="/sign-in" onClick={() => setOpen(false)} className="mt-2 block rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-700">Sign in</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-slate-950 px-3 py-3 text-center text-sm font-semibold text-white">Dashboard</Link>
              <Link href="/ai-advisor" onClick={() => setOpen(false)} className="mt-1 block rounded-xl px-3 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">AI Finance Chat</Link>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}