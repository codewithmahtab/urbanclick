"use client";

import { useState, useActionState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addReviewAction } from "../actions/add-review";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  isLoggedIn: boolean;
  hasReviewed?: boolean;
}

export default function ReviewForm({
  productId,
  isLoggedIn,
  hasReviewed,
}: ReviewFormProps) {
  const pathname = usePathname();
  const [rating, setRating] = useState(0);
  const [clientError, setClientError] = useState("");

  const [state, action, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      setClientError("");
      if (rating === 0) {
        setClientError("Please select a star rating.");
        return null;
      }
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      return addReviewAction(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById("review-form") as HTMLFormElement;
      if (form) form.reset();
      // Use a timeout to move state update out of the synchronous effect body
      const timer = setTimeout(() => setRating(0), 0);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold">Write a Review</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          You must be logged in to share your thoughts on this product.
        </p>
        <Link href={`/login?redirectTo=${encodeURIComponent(pathname)}`}>
          <Button variant="default" className="bg-yellow-400 text-black hover:bg-yellow-500">
            Login to write a review
          </Button>
        </Link>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="rounded-xl border border-border bg-background p-6">
        <h3 className="mb-2 text-lg font-semibold">Thank you!</h3>
        <p className="text-sm text-muted-foreground">
          You have already submitted a review for this product. We appreciate your feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
      <form id="review-form" action={action} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none cursor-pointer p-1 -ml-1"
                onClick={() => {
                  setRating(star);
                  if (clientError) setClientError("");
                }}
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-transparent text-neutral-300/30 hover:text-neutral-400"
                  )}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="mb-1 block text-sm font-medium">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={4}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="What did you like or dislike?"
          ></textarea>
        </div>

        {(clientError || state?.error) && !isPending && (
          <p className="text-sm text-red-500">{clientError || state?.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-500">Review submitted successfully!</p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-black h-10 px-4 text-white hover:bg-neutral-800"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </form>
    </div>
  );
}
