import { prisma } from "@/lib/prisma";

export async function getReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return reviews;
}
