"use client";

import { Heart, Loader2, CheckCheck } from "lucide-react";
import { useTransition, useOptimistic, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toggleWishlistAction } from "@/features/products/actions/toggle-wishlist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import WishlistAddedModal from "@/features/wishlist/components/wishlist-added-modal";

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    priceInPaise: number;
    imageUrl: string;
    slug: string;
    stock: number;
  };
  initialIsWishlisted: boolean;
}

export default function WishlistButton({
  product,
  initialIsWishlisted,
}: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [optimisticIsWishlisted, toggleOptimistic] = useOptimistic(
    initialIsWishlisted,
    (state) => !state,
  );

  const handleToggle = () => {
    startTransition(async () => {
      // Check auth first before applying optimistic update
      const res = await toggleWishlistAction(product.id);

      if (res.unauthorized) {
        router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
        return;
      }

      // Only flip UI after we know the user is authenticated
      toggleOptimistic(null);

      if (res.success && res.isWishlisted) {
        setShowModal(true);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "rounded-full h-12 w-12 transition-all duration-300 shadow-md",
          optimisticIsWishlisted 
            ? "bg-primary text-white border-primary hover:bg-primary/90" 
            : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-background border-border",
        )}
      >
        {isPending ? (
          <Loader2 size={22} className="animate-spin" />
        ) : optimisticIsWishlisted ? (
          <CheckCheck className="size-6" />
        ) : (
          <Heart className="size-6" />
        )}
      </Button>

      <WishlistAddedModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        product={product}
      />
    </>
  );
}
