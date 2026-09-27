import { getUserAccounts } from "@/actions/dashboard";
import { AccountCard } from "../dashboard/_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, WalletCards } from "lucide-react";

export default async function AccountsPage() {
  const accounts = (await getUserAccounts()) || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8"><p className="text-sm font-semibold text-blue-600">Accounts</p><h1 className="mt-1 text-3xl font-black tracking-tight">Your money, organized.</h1><p className="mt-2 text-slate-500">Manage balances and open an account to see its full transaction history.</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer><Card className="min-h-[190px] cursor-pointer rounded-3xl border-dashed border-slate-300 hover:border-blue-300 hover:bg-blue-50/40"><CardContent className="flex h-full flex-col items-center justify-center text-slate-500"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Plus className="h-5 w-5" /></div><p className="mt-3 font-bold">Add account</p></CardContent></Card></CreateAccountDrawer>
        {accounts.map((account) => <AccountCard key={account.id} account={account} />)}
      </div>
      {accounts.length === 0 && <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center"><WalletCards className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-bold">No accounts yet</p><p className="mt-1 text-sm text-slate-500">Create your first account to start tracking money.</p></div>}
    </div>
  );
}
