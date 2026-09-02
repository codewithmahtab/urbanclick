"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { UpdateNameSchema } from "@/features/account/validations/security";
import { revalidatePath } from "next/cache";

export async function updateNameAction(_prevState: any, formData: FormData) {
  const nameData = formData.get("name");

  const validatedFields = UpdateNameSchema.safeParse({ name: nameData });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return { fieldErrors };
  }

  const { name } = validatedFields.data;

  try {
    const session = await requireSession();

    await prisma.user.update({
      where: { id: session.userId },
      data: { name },
    });

    revalidatePath("/account/security");
    return { success: true };
  } catch (error) {
    console.error("Update name error:", error);
    return { formError: "Failed to update name. Please try again." };
  }
}
