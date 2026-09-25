import { inngest } from "./client";

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    triggers: [{ event: "transaction.recurring.process" }],
  },
  async ({ event, step }) => {
    // Implementation pending
    console.log("Processing recurring transaction", event.data);
    return { success: true };
  }
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    triggers: [{ cron: "0 0 * * *" }], // Daily at midnight
  },
  async ({ step }) => {
    // Implementation pending
    console.log("Triggering recurring transactions");
    return { success: true };
  }
);

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    triggers: [{ cron: "0 0 1 * *" }], // First day of every month
  },
  async ({ step }) => {
    // Implementation pending
    console.log("Generating monthly reports");
    return { success: true };
  }
);

export const checkBudgetAlerts = inngest.createFunction(
  {
    id: "check-budget-alerts",
    triggers: [{ cron: "0 0 * * *" }], // Daily check
  },
  async ({ step }) => {
    // Implementation pending
    console.log("Checking budget alerts");
    return { success: true };
  }
);
