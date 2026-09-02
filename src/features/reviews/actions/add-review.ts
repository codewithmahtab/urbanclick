"use server";

import { getSession } from "@/features/auth/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReviewAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "UNAUTHENTICATED" };
  }

  const productId = formData.get("productId")?.toString();
  const ratingStr = formData.get("rating")?.toString();
  const comment = formData.get("comment")?.toString();

  if (!productId || !ratingStr || !comment) {
    return { success: false, error: "Missing fields" };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Invalid rating" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create or update the review
      // We use upsert because the schema has a unique constraint on [userId, productId]
      await tx.review.upsert({
        where: {
          userId_productId: {
            userId: session.userId,
            productId: productId,
          },
        },
        update: {
          rating,
          comment,
        },
        create: {
          userId: session.userId,
          productId: productId,
          rating,
          comment,
        },
      });

      // 2. Aggregate new rating and total reviews
      const aggregations = await tx.review.aggregate({
        where: { productId },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      });

      const averageRating = aggregations._avg.rating || 0;
      const totalReviews = aggregations._count.id;

      // 3. Update the product
      await tx.product.update({
        where: { id: productId },
        data: {
          averageRating,
          totalReviews,
        },
      });
    });

    revalidatePath("/product/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("Failed to add review:", error);
    return { success: false, error: "Failed to add review" };
  }
}
