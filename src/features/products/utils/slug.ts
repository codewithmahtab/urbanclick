import "server-only";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";

export async function createProductSlug(productName: string) {
  const baseSlug = generateSlug(productName);

  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.product.findUnique({
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
