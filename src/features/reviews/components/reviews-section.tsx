import { getSession } from "@/features/auth/lib/session";
import { getReviews } from "../services/get-reviews";
import ReviewForm from "./review-form";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ReviewsSection({
  productId,
}: {
  productId: string;
}) {
  const session = await getSession();
  const reviews = await getReviews(productId);

  const hasReviewed = !!session && reviews.some(
    (review) => review.userId === session.userId
  );

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Customer Reviews</h2>

      <div className="flex flex-col gap-10">
        <div className="w-full">
          <ReviewForm
            productId={productId}
            isLoggedIn={!!session}
            hasReviewed={hasReviewed}
          />
        </div>

        <div className="w-full space-y-6 mt-4">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{review.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mb-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        review.rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
