import Link from "next/link";
import { getUserTransactions } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowDownRight, ArrowUpRight, ReceiptText } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";

export default async function TransactionsPage() {
  const result = await getUserTransactions();
  const transactions = result?.data || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-blue-600">Activity</p><h1 className="mt-1 text-3xl font-black tracking-tight">Transactions</h1><p className="mt-2 text-slate-500">Every recorded income and expense in one place.</p></div>
        <Button asChild className="rounded-xl bg-slate-950 hover:bg-slate-800"><Link href="/transaction/create"><Plus className="mr-2 h-4 w-4" /> Add transaction</Link></Button>
      </div>
      <Card className="overflow-hidden rounded-3xl border-slate-200"><CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="px-6 py-16 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><ReceiptText className="h-6 w-6" /></div><h2 className="mt-4 font-bold">No transactions yet</h2><p className="mt-1 text-sm text-slate-500">Add your first transaction and it will appear here.</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => {
              const expense = transaction.type === "EXPENSE";
              return <div key={transaction.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={expense ? "rounded-xl bg-rose-50 p-2.5 text-rose-600" : "rounded-xl bg-emerald-50 p-2.5 text-emerald-600"}>{expense ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</div>
                  <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{transaction.description || "Untitled transaction"}</p><p className="mt-0.5 text-xs text-slate-400">{transaction.category} · {transaction.account?.name || "Account"} · {format(new Date(transaction.date), "dd MMM yyyy")}</p></div>
                </div>
                <p className={expense ? "shrink-0 font-bold text-rose-600" : "shrink-0 font-bold text-emerald-600"}>{expense ? "-" : "+"}{formatCurrency(transaction.amount)}</p>
              </div>;
            })}
          </div>
        )}
      </CardContent></Card>
    </div>
  );
}
