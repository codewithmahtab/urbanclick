"use server";

import { deleteSession, createSession } from "@/features/auth/lib/session";
import { prisma } from "@/lib/prisma";

const GUEST_EMAIL = "seller1@shopreal.com";

export async function loginAsGuest() {
  await deleteSession();

  const user = await prisma.user.findUnique({
    where: { email: GUEST_EMAIL },
    select: { id: true, isVerified: true },
  });

  if (!user) {
    throw new Error("Guest account not found. Make sure the database is seeded.");
  }

  await createSession(user.id, user.isVerified);
}
