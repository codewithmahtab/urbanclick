export const instant = false;

import { getCart } from "@/features/cart/services/get-cart";
import { getAddresses } from "@/features/addresses/services/get-addresses";
import CheckoutView from "@/features/checkout/components/checkout-view";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const productId = typeof params.productId === "string" ? params.productId : undefined;
  const quantityParam = typeof params.quantity === "string" ? params.quantity : undefined;

  let cart;
  let buyNowParams;

  if (productId && quantityParam) {
    const quantity = parseInt(quantityParam, 10);
    if (!isNaN(quantity) && quantity > 0) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, priceInPaise: true, imageUrl: true, sku: true },
      });

      if (product) {
        cart = {
          items: [
            {
              id: "temp-buy-now",
              quantity,
              product: {
                name: product.name,
                priceInPaise: product.priceInPaise,
                imageUrl: product.imageUrl,
              },
            },
          ],
        };
        buyNowParams = { productId, quantity };
      }
    }
  }

  if (!cart) {
    cart = await getCart();
  }

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const addresses = await getAddresses();

  return <CheckoutView cart={cart} addresses={addresses} buyNowParams={buyNowParams} />;
}
