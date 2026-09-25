"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    CalendarIcon, 
    Loader2, 
    ArrowLeftRight, 
    LayoutGrid, 
    Calendar as CalendarLucide, 
    CreditCard, 
    FileText, 
    PlusCircle,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
    accounts,
    categories,
    editMode = false,
    initialData = null,
}) {
    const hasAccounts = accounts.length > 0;
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
        reset,
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues:
            editMode && initialData
                ? {
                    type: initialData.type,
                    amount: initialData.amount.toString(),
                    description: initialData.description,
                    accountId: initialData.accountId,
                    category: initialData.category,
                    date: new Date(initialData.date),
                    isRecurring: initialData.isRecurring,
                    ...(initialData.recurringInterval && {
                        recurringInterval: initialData.recurringInterval,
                    }),
                }
                : {
                    type: "EXPENSE",
                    amount: "",
                    description: "",
                    accountId: accounts.find((ac) => ac.isDefault)?.id || "",
                    category: "",
                    date: new Date(),
                    isRecurring: false,
                },
    });

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
    } = useFetch(editMode ? updateTransaction : createTransaction);

    const onSubmit = (data) => {
        const formData = {
            ...data,
            amount: parseFloat(data.amount),
        };

        if (editMode) {
            transactionFn(editId, formData);
        } else {
            transactionFn(formData);
        }
    };

    const handleScanComplete = (scannedData) => {
        if (scannedData) {
            setValue("amount", scannedData.amount.toString());
            setValue("date", new Date(scannedData.date));
            if (scannedData.description) {
                setValue("description", scannedData.description);
            }
            if (scannedData.category) {
                setValue("category", scannedData.category);
            }
            toast.success("Receipt scanned successfully");
        }
    };

    useEffect(() => {
        if (transactionResult?.success && !transactionLoading) {
            toast.success(
                editMode
                    ? "Transaction updated successfully"
                    : "Transaction created successfully"
            );
            reset();
            router.push(`/dashboard`);
        }
    }, [transactionResult, transactionLoading, editMode]);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const filteredCategories = categories.filter(
        (category) => category.type === type
    );

    return (
        <div className="bg-white w-full rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 sm:p-8 border border-gray-100/60 relative overflow-hidden transition-all">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

                {/* Row 1: Type & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Transaction Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Transaction Type <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div className={cn(
                                "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors",
                                type === "INCOME" ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {type === "INCOME" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            </div>
                            <select 
                                {...register("type")}
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium", 
                                    errors.type ? "border-red-500 focus:ring-red-500/20" : "border-gray-200",
                                    type === "INCOME" ? "text-emerald-700 bg-emerald-50/30 focus:ring-emerald-500/20" : "text-rose-700 bg-rose-50/30 focus:ring-rose-500/20"
                                )}
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <select 
                                {...register("category")}
                                className={cn("w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 bg-white appearance-none cursor-pointer hover:border-blue-200", errors.category ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200")}
                            >
                                <option value="" disabled>Select Category</option>
                                {filteredCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                    </div>
                </div>

                {/* Row 2: Amount & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Amount <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium group-focus-within:text-blue-600 transition-colors text-lg">
                                ₹
                            </div>
                            <input 
                                type="number" 
                                step="0.01" 
                                placeholder="0.00" 
                                {...register("amount")}
                                className={cn(
                                    "w-full pl-9 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white placeholder-gray-400 font-semibold text-lg hover:border-blue-200", 
                                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.amount ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200"
                                )}
                            />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Date <span className="text-red-500">*</span></label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "w-full flex items-center pl-3 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 bg-white group hover:border-blue-200",
                                        errors.date ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200",
                                        !date && "text-gray-400"
                                    )}
                                >
                                    <CalendarLucide className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <span className="font-medium">{date ? format(date, "PPP") : <span>Pick a date</span>}</span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => setValue("date", selectedDate)}
                                    disabled={(d) =>
                                        d > new Date() || d < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                    </div>
                </div>

                {/* Account */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <label className="block text-sm font-semibold text-gray-700">Account</label>
                        {!hasAccounts && (
                            <CreateAccountDrawer>
                                <Button type="button" variant="outline" size="sm">
                                    Create Account
                                </Button>
                            </CreateAccountDrawer>
                        )}
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <select 
                            {...register("accountId")}
                            disabled={!hasAccounts}
                            className={cn("w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 bg-white appearance-none cursor-pointer hover:border-blue-200 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400", errors.accountId ? "border-red-500" : "border-gray-200")}
                        >
                            <option value="" disabled>
                                {hasAccounts ? "Select account" : "No accounts available"}
                            </option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>
                    {!hasAccounts && (
                        <p className="text-xs text-gray-500">
                            Create an account first before adding a transaction.
                        </p>
                    )}
                    {errors.accountId && <p className="text-red-500 text-xs">{errors.accountId.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Note / Description</label>
                    <div className="relative group">
                        <div className="absolute top-3 left-3 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <FileText className="w-5 h-5" />
                        </div>
                        <textarea 
                            rows="3" 
                            placeholder="Add description (optional)" 
                            {...register("description")}
                            className={cn("w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 bg-white resize-none hover:border-blue-200", errors.description ? "border-red-500" : "border-gray-200")}
                        ></textarea>
                    </div>
                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                </div>

                {/* Recurring Toggle */}
                <div className="flex flex-row items-center justify-between rounded-xl border border-gray-100 p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-900">Recurring Transaction</label>
                        <div className="text-sm text-gray-500">
                            Set up a regular schedule for this transaction
                        </div>
                    </div>
                    <Switch
                        checked={isRecurring}
                        onCheckedChange={(checked) => setValue("isRecurring", checked)}
                    />
                </div>

                {/* Recurring Interval */}
                {isRecurring && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                        <label className="block text-sm font-semibold text-gray-700">Recurring Interval</label>
                        <select 
                            {...register("recurringInterval")}
                            className={cn("w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 bg-white appearance-none cursor-pointer hover:border-blue-200", errors.recurringInterval ? "border-red-500" : "border-gray-200")}
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="YEARLY">Yearly</option>
                        </select>
                        {errors.recurringInterval && <p className="text-red-500 text-xs">{errors.recurringInterval.message}</p>}
                    </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button 
                        type="button" 
                        onClick={() => router.back()} 
                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 hover:text-gray-900 transition-all focus:ring-2 focus:ring-gray-200 outline-none"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={transactionLoading || !hasAccounts}
                        className="w-full flex-1 py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                        {transactionLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <PlusCircle className="w-5 h-5" />
                        )}
                        {transactionLoading 
                            ? (editMode ? "Updating Transaction..." : "Adding Transaction...") 
                            : (editMode ? "Save Changes" : "Add Transaction")
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
