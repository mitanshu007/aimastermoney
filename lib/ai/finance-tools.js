"use server";

import { db } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/get-or-create-user";

const toNumber = (value) => Number(value || 0);

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfPreviousMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function endOfPreviousMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);
}

function monthLabel(date) {
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

async function getUser(userId) {
  return getOrCreateUser(userId);
}

export async function getAccountBalances(userId) {
  const user = await getUser(userId);
  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: { name: true, type: true, balance: true, isDefault: true },
  });

  return {
    currency: "INR",
    accounts: accounts.map((account) => ({
      name: account.name,
      type: account.type,
      balance: toNumber(account.balance),
      isDefault: account.isDefault,
    })),
    totalBalance: accounts.reduce((sum, account) => sum + toNumber(account.balance), 0),
  };
}

export async function getMonthlySummary(userId, { monthOffset = 0 } = {}) {
  const user = await getUser(userId);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + Number(monthOffset || 0), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + Number(monthOffset || 0) + 1, 1);

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: start, lt: end },
      status: "COMPLETED",
    },
    select: { type: true, amount: true, category: true, description: true, date: true },
    orderBy: { date: "desc" },
  });

  const income = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);

  return {
    currency: "INR",
    month: monthLabel(start),
    transactionCount: transactions.length,
    income,
    expenses,
    netCashflow: income - expenses,
    savingsRate: income > 0 ? Number((((income - expenses) / income) * 100).toFixed(2)) : null,
  };
}

export async function getSpendingByCategory(userId, { monthOffset = 0 } = {}) {
  const user = await getUser(userId);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + Number(monthOffset || 0), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + Number(monthOffset || 0) + 1, 1);

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: start, lt: end },
      status: "COMPLETED",
      type: "EXPENSE",
    },
    select: { amount: true, category: true },
  });

  const byCategory = {};
  for (const transaction of transactions) {
    const category = transaction.category || "Other";
    byCategory[category] = (byCategory[category] || 0) + toNumber(transaction.amount);
  }

  const categories = Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount: Number(amount.toFixed(2)) }))
    .sort((a, b) => b.amount - a.amount);

  return {
    currency: "INR",
    month: monthLabel(start),
    totalExpenses: categories.reduce((sum, item) => sum + item.amount, 0),
    categories: categories.slice(0, 20),
  };
}

export async function getBudgetStatus(userId) {
  const user = await getUser(userId);
  const budget = await db.budget.findUnique({
    where: { userId: user.id },
    select: { amount: true },
  });

  if (!budget) {
    return { hasBudget: false, currency: "INR", message: "No monthly budget is configured." };
  }

  const summary = await getMonthlySummary(userId);
  const limit = toNumber(budget.amount);
  const spent = summary.expenses;
  const remaining = limit - spent;

  return {
    hasBudget: true,
    currency: "INR",
    month: summary.month,
    budget: limit,
    spent,
    remaining,
    percentUsed: limit > 0 ? Number(((spent / limit) * 100).toFixed(2)) : null,
    overBudget: remaining < 0,
  };
}

export async function getRecurringExpenses(userId) {
  const user = await getUser(userId);
  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      type: "EXPENSE",
      isRecurring: true,
      status: "COMPLETED",
    },
    select: {
      amount: true,
      category: true,
      description: true,
      recurringInterval: true,
      nextRecurringDate: true,
      account: { select: { name: true } },
    },
    orderBy: { amount: "desc" },
  });

  return {
    currency: "INR",
    recurringExpenses: transactions.map((transaction) => ({
      amount: toNumber(transaction.amount),
      category: transaction.category,
      description: transaction.description || "",
      interval: transaction.recurringInterval || "UNKNOWN",
      nextDate: transaction.nextRecurringDate?.toISOString().slice(0, 10) || null,
      account: transaction.account?.name || "",
    })),
  };
}

export async function searchTransactions(userId, { query = "", limit = 10 } = {}) {
  const user = await getUser(userId);
  const cleanQuery = String(query || "").trim().slice(0, 100);
  if (!cleanQuery) return { currency: "INR", transactions: [] };

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      OR: [
        { description: { contains: cleanQuery, mode: "insensitive" } },
        { category: { contains: cleanQuery, mode: "insensitive" } },
      ],
    },
    orderBy: { date: "desc" },
    take: Math.min(Math.max(Number(limit) || 10, 1), 25),
    select: {
      type: true,
      amount: true,
      category: true,
      description: true,
      date: true,
      status: true,
      account: { select: { name: true } },
    },
  });

  return {
    currency: "INR",
    transactions: transactions.map((transaction) => ({
      type: transaction.type,
      amount: toNumber(transaction.amount),
      category: transaction.category,
      description: transaction.description || "",
      date: transaction.date.toISOString().slice(0, 10),
      status: transaction.status,
      account: transaction.account?.name || "",
    })),
  };
}

export async function getRecentTransactions(userId, { limit = 15 } = {}) {
  const user = await getUser(userId);
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: Math.min(Math.max(Number(limit) || 15, 1), 30),
    select: {
      type: true,
      amount: true,
      category: true,
      description: true,
      date: true,
      status: true,
      isRecurring: true,
      account: { select: { name: true } },
    },
  });

  return {
    currency: "INR",
    transactions: transactions.map((transaction) => ({
      type: transaction.type,
      amount: toNumber(transaction.amount),
      category: transaction.category,
      description: transaction.description || "",
      date: transaction.date.toISOString().slice(0, 10),
      status: transaction.status,
      recurring: transaction.isRecurring,
      account: transaction.account?.name || "",
    })),
  };
}

export async function getFinanceSnapshot(userId) {
  const [accounts, currentMonth, previousMonth, categories, budget, recurring] = await Promise.all([
    getAccountBalances(userId),
    getMonthlySummary(userId, { monthOffset: 0 }),
    getMonthlySummary(userId, { monthOffset: -1 }),
    getSpendingByCategory(userId, { monthOffset: 0 }),
    getBudgetStatus(userId),
    getRecurringExpenses(userId),
  ]);

  return {
    accounts,
    currentMonth,
    previousMonth,
    spendingByCategory: categories,
    budget,
    recurringExpenses: recurring,
  };
}

export const FINANCE_TOOL_DEFINITIONS = [
  {
    type: "function",
    name: "get_account_balances",
    description: "Read the user's current account balances and total balance. Use for questions about available money, balances, or accounts.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    type: "function",
    name: "get_monthly_summary",
    description: "Calculate deterministic income, expenses, net cashflow, transaction count, and savings rate for a month. monthOffset 0 is the current month and -1 is the previous month.",
    parameters: {
      type: "object",
      properties: {
        monthOffset: { type: "integer", description: "Month offset relative to the current month, usually 0 or -1." },
      },
    },
  },
  {
    type: "function",
    name: "get_spending_by_category",
    description: "Calculate current or previous month spending grouped by transaction category.",
    parameters: {
      type: "object",
      properties: {
        monthOffset: { type: "integer", description: "Month offset relative to the current month, usually 0 or -1." },
      },
    },
  },
  {
    type: "function",
    name: "get_budget_status",
    description: "Read the user's monthly budget and calculate amount spent, remaining amount, percentage used, and whether the budget is exceeded.",
    parameters: { type: "object", properties: {} },
  },
  {
    type: "function",
    name: "get_recurring_expenses",
    description: "List the user's recurring completed expenses with amount, category, interval, next date, and account.",
    parameters: { type: "object", properties: {} },
  },
  {
    type: "function",
    name: "get_recent_transactions",
    description: "Read a small list of recent transactions for factual transaction-level questions.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "integer", description: "Number of recent transactions, maximum 30." },
      },
    },
  },
  {
    type: "function",
    name: "search_transactions",
    description: "Search transaction descriptions and categories for a user-provided keyword. Use for finding merchants, categories, or specific transaction text.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Merchant, category, or keyword to search for." },
        limit: { type: "integer", description: "Maximum number of matches, up to 25." },
      },
      required: ["query"],
    },
  },
];

export async function executeFinanceTool(name, args, userId) {
  const safeArgs = args && typeof args === "object" ? args : {};

  switch (name) {
    case "get_account_balances":
      return getAccountBalances(userId);
    case "get_monthly_summary":
      return getMonthlySummary(userId, safeArgs);
    case "get_spending_by_category":
      return getSpendingByCategory(userId, safeArgs);
    case "get_budget_status":
      return getBudgetStatus(userId);
    case "get_recurring_expenses":
      return getRecurringExpenses(userId);
    case "get_recent_transactions":
      return getRecentTransactions(userId, safeArgs);
    case "search_transactions":
      return searchTransactions(userId, safeArgs);
    default:
      throw new Error("Unknown finance tool.");
  }
}
