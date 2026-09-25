import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma.js";

export async function getOrCreateUser(clerkUserId) {
  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  const existingUser = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await currentUser();

  if (!clerkUser || clerkUser.id !== clerkUserId) {
    throw new Error("User not found");
  }

  const firstEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!firstEmail) {
    throw new Error("User email not found");
  }

  return db.user.create({
    data: {
      clerkUserId: clerkUser.id,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" "),
      imageUrl: clerkUser.imageUrl,
      email: firstEmail,
    },
  });
}
