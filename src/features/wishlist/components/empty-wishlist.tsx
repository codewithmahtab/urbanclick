import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Your wishlist is empty
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Save items you love here to buy them later.
      </p>
      <Link href="/">
        <Button size="lg" className="h-12 px-8">
          Explore Products
        </Button>
      </Link>
    </div>
  );
}
