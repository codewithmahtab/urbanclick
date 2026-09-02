import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Link href="/">
        <Button size="lg" className="h-12 px-8">
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}
