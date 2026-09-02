"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  totalItems: number;
  subtotal: number;
  pending: boolean;
  isAuthenticated: boolean;
}

export default function CartSummary({
  totalItems,
  subtotal,
  pending,
  isAuthenticated,
}: CartSummaryProps) {
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirectTo=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight text-xl">
          Order Summary
        </h3>
      </div>
      <div className="p-6 pt-0 flex flex-col gap-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxes</span>
          <span className="font-medium text-muted-foreground">
            Calculated at checkout
          </span>
        </div>

        <div className="my-4 border-t" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <Button
          className="w-full mt-4 h-12 text-md font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-full"
          onClick={handleCheckout}
          disabled={totalItems === 0 || pending}
        >
          {pending ? "Processing..." : isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
