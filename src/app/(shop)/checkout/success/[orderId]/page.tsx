export const instant = false;

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  const { userId } = await requireSession();

  const order = await prisma.order.findUnique({
    where: {
      id: resolvedParams.orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order || order.userId !== userId) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold">Order Confirmed!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for your purchase. Your order #
            {order.id.slice(-8).toUpperCase()} has been placed successfully.
          </p>
        </div>

        <div className="bg-muted p-6 rounded-xl text-left space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Order Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Items ({order.items.length})
            </span>
            <span className="font-medium">
              {formatCurrency(order.subtotalInPaise)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {formatCurrency(order.shippingInPaise)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span>{formatCurrency(order.totalInPaise)}</span>
          </div>
        </div>

        <div>
          <Link href="/">
            <Button className="w-full h-12 bg-yellow-400 text-black hover:bg-yellow-500 rounded-full font-bold">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
