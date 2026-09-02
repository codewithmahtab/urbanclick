import "server-only";
import { prisma } from "@/lib/prisma";
import { productDetailSelect } from "@/features/products/types/products";
import { cacheLife, cacheTag } from "next/cache";

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);
  return prisma.product.findFirst({
    where: {
      slug,
      isPublished: true,
      isDeleted: false,
      seller: {
        status: "APPROVED",
      },
    },
    select: productDetailSelect,
  });
}
