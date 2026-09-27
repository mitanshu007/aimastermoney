import { currentUser } from "@clerk/nextjs/server";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDownRight, ArrowUpRight, Wallet, Activity, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

export default async function DashboardPage() {
  const [user, accountsData, transactionsData] = await Promise.all([currentUser(), getUserAccounts(), getDashboardData()]);
  const accounts = accountsData || [];
  const transactions = transactionsData || [];
  const defaultAccount = accounts.find((account) => account.isDefault) || accounts[0];
  const budgetData = defaultAccount ? await getCurrentBudget(defaultAccount.id) : null;
  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  const income = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const expenses = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const net = income - expenses;
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const monthlyExpenses = transactions.filter((t) => t.type === "EXPENSE").filter((t) => { const date = new Date(t.date); return date.getMonth() === month && date.getFullYear() === year; }).reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Personal finance dashboard</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Welcome back{user?.firstName ? ", " + user.firstName : ""}.</h1>
          <p className="mt-2 text-slate-500">Here is your financial picture at a glance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-xl"><Link href="/transaction/create"><Plus className="mr-2 h-4 w-4" /> Add transaction</Link></Button>
          <CreateAccountDrawer><Button className="rounded-xl bg-slate-950 hover:bg-slate-800"><Plus className="mr-2 h-4 w-4" /> Add account</Button></CreateAccountDrawer>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total balance", value: formatCurrency(totalBalance), icon: Wallet, tone: "bg-slate-950 text-white", note: accounts.length + " account" + (accounts.length === 1 ? "" : "s") },
          { label: "Income tracked", value: formatCurrency(income), icon: ArrowUpRight, tone: "bg-emerald-50 text-emerald-700", note: "All recorded income" },
          { label: "Expenses tracked", value: formatCurrency(expenses), icon: ArrowDownRight, tone: "bg-rose-50 text-rose-700", note: "All recorded expenses" },
          { label: "Net cashflow", value: formatCurrency(net), icon: Activity, tone: net >= 0 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700", note: transactions.length + " transaction" + (transactions.length === 1 ? "" : "s") },
        ].map(({ label, value, icon: Icon, tone, note }) => (
          <Card key={label} className="rounded-3xl border-slate-200 shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><div className={tone + " rounded-xl p-2.5"}><Icon className="h-4 w-4" /></div></div><p className="mt-5 text-2xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></CardContent></Card>
        ))}
      </div>

      {accounts.length === 0 ? (
        <Card className="mt-6 overflow-hidden rounded-3xl border-slate-200"><CardContent className="relative p-8 sm:p-12"><div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" /><div className="relative max-w-2xl"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Sparkles className="h-6 w-6" /></div><h2 className="mt-6 text-2xl font-black tracking-tight">Your workspace is ready.</h2><p className="mt-2 max-w-xl leading-7 text-slate-600">Create your first account with its current balance. Once it exists, you can start recording income, expenses and a monthly budget.</p><div className="mt-6"><CreateAccountDrawer><Button className="rounded-xl bg-slate-950 hover:bg-slate-800"><Plus className="mr-2 h-4 w-4" /> Create first account</Button></CreateAccountDrawer></div></div></CardContent></Card>
      ) : (
        <>
          <div className="mt-6"><BudgetProgress initialBudget={budgetData?.budget} currentExpenses={budgetData?.currentExpenses || 0} /></div>
          <div className="mt-6"><DashboardOverview accounts={accounts} transactions={transactions} /></div>
          <div className="mt-6">
            <div className="mb-4"><h2 className="text-xl font-black tracking-tight">Your accounts</h2><p className="text-sm text-slate-500">Choose a default account and drill into its activity.</p></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <CreateAccountDrawer><Card className="min-h-[180px] cursor-pointer rounded-3xl border-dashed border-slate-300 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40"><CardContent className="flex h-full flex-col items-center justify-center text-slate-500"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"><Plus className="h-5 w-5" /></div><p className="mt-3 text-sm font-bold">Add new account</p></CardContent></Card></CreateAccountDrawer>
              {accounts.map((account) => <AccountCard key={account.id} account={account} />)}
            </div>
          </div>
          <Card className="mt-6 rounded-3xl border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-none"><CardContent className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-blue-700">This month</p><p className="text-sm text-slate-600">You have tracked {formatCurrency(monthlyExpenses)} in expenses this month.</p></div><Link href="/transaction/create" className="text-sm font-bold text-blue-700 hover:text-blue-900">Add an expense →</Link></CardContent></Card>
        </>
      )}
    </div>
  );
}
