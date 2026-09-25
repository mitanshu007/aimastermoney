"use server";

import aj from "@/lib/arcjet";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getOrCreateUser(userId);

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Serialize accounts before sending to client
    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await getOrCreateUser(userId);

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // If it's the first account, make it default regardless of user input
    // If not, use the user's preference
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new account
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault, // Override the isDefault based on our logic
      },
    });

    // Serialize the account before returning
    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateAccount(accountId, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getOrCreateUser(userId);

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccount = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!existingAccount) {
      throw new Error("Account not found");
    }

    const userAccounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    let shouldBeDefault = data.isDefault;

    if (userAccounts.length === 1) {
      shouldBeDefault = true;
    } else if (existingAccount.isDefault && !data.isDefault) {
      throw new Error("Select another default account before removing this one.");
    }

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAccount = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: {
        ...data,
        balance: balanceFloat,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${accountId}`);

    return { success: true, data: serializeTransaction(updatedAccount) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getOrCreateUser(userId);

    const userAccounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    if (userAccounts.length <= 1) {
      throw new Error("You must keep at least one account.");
    }

    const account = userAccounts.find((item) => item.id === accountId);

    if (!account) {
      throw new Error("Account not found");
    }

    const nextDefaultAccount = account.isDefault
      ? userAccounts.find((item) => item.id !== accountId)
      : null;

    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          accountId,
          userId: user.id,
        },
      });

      await tx.account.delete({
        where: {
          id: accountId,
          userId: user.id,
        },
      });

      if (nextDefaultAccount) {
        await tx.account.update({
          where: {
            id: nextDefaultAccount.id,
            userId: user.id,
          },
          data: { isDefault: true },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${accountId}`);

    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getOrCreateUser(userId);

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
