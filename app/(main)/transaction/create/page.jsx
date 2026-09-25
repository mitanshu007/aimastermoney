import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import Link from "next/link";
import { ArrowLeft, CreditCard, PlusCircle } from "lucide-react";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";

export default async function AddTransactionPage({ searchParams }) {
    const accounts = await getUserAccounts();
    const params = await searchParams;
    const editId = params?.edit;

    let initialData = null;
    if (editId) {
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }

    if (!editId && accounts.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col mb-8 gap-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors w-fit group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="mt-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Add Transaction</h1>
                        <p className="text-gray-500 mt-1">Record your income or expense</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <CreditCard className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">Create an account first</h2>
                    <p className="mt-2 text-gray-600">
                        You need at least one account before you can add a transaction.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <CreateAccountDrawer>
                            <Button className="sm:w-auto">
                                <PlusCircle className="h-4 w-4" />
                                Create Account
                            </Button>
                        </CreateAccountDrawer>
                        <Button asChild variant="outline" className="sm:w-auto">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col mb-8 gap-2">
                <Link 
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors w-fit group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <div className="mt-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Add Transaction</h1>
                    <p className="text-gray-500 mt-1">Record your income or expense</p>
                </div>
            </div>
            
            <AddTransactionForm
                accounts={accounts}
                categories={defaultCategories}
                editMode={!!editId}
                initialData={initialData}
            />
        </div>
    );
}
