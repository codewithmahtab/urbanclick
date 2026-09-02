import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 24, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = rating >= i + 1;
        const isHalf = !isFull && rating > i;

        if (isHalf) {
          return (
            <div key={i} className="relative inline-flex">
              <Star size={size} className="text-muted-foreground/60" />
              
              <div className="absolute left-0 top-0 overflow-hidden w-[50%]">
                <Star size={size} className="fill-amber-400 text-amber-400" />
              </div>
            </div>
          );
        }

        return (
          <Star
            key={i}
            size={size}
            className={cn(
              isFull
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/60",
            )}
          />
        );
      })}
    </div>
  );
}
