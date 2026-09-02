import "server-only";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";

export async function createSellerSlug(storeName: string) {
  const baseSlug = generateSlug(storeName);

  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.seller.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
