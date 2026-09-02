"use server";

import { deleteSession } from "@/features/auth/lib/session";
import { redirect } from "next/navigation";

export async function logout(redirectTo = "/") {
  await deleteSession();

  redirect(redirectTo);
}
