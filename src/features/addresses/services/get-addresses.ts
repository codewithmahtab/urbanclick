import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";

export async function getAddresses() {
  const { userId } = await requireSession();

  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });
}
