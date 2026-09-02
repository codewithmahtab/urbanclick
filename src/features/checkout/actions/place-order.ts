"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function placeOrderAction(_prevState: any, formData: FormData) {
  let orderId: string | undefined;

  try {
    const { userId } = await requireSession();

    const addressId = formData.get("addressId") as string;
    if (!addressId) {
      return { success: false, error: "Please select a delivery address." };
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      return { success: false, error: "Invalid delivery address." };
    }

    const buyNowProductId = formData.get("buyNowProductId") as string | null;
    const buyNowQuantity = parseInt(formData.get("buyNowQuantity") as string, 10);

    let itemsToCheckout: {
      productId: string;
      quantity: number;
      priceInPaise: number;
      productName: string;
      sku: string;
    }[] = [];
    let cartIdToDelete: string | null = null;

    if (buyNowProductId && !isNaN(buyNowQuantity)) {
      // Buy Now Flow
      const product = await prisma.product.findUnique({
        where: { id: buyNowProductId },
      });

      if (!product) {
        return { success: false, error: "Product not found" };
      }

      itemsToCheckout = [
        {
          productId: product.id,
          quantity: buyNowQuantity,
          priceInPaise: product.priceInPaise,
          productName: product.name,
          sku: product.sku,
        },
      ];
    } else {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return { success: false, error: "Cart is empty" };
      }

      cartIdToDelete = cart.id;
      itemsToCheckout = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceInPaise: item.product.priceInPaise,
        productName: item.product.name,
        sku: item.product.sku,
      }));
    }

    const subtotalInPaise = itemsToCheckout.reduce(
      (acc, item) => acc + item.priceInPaise * item.quantity,
      0,
    );
    const shippingInPaise = 5000; // Fixed shipping for now
    const discountInPaise = 0;
    const totalInPaise = subtotalInPaise + shippingInPaise - discountInPaise;

    // Validate stock availability before placing the order
    const productIds = itemsToCheckout.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true },
    });

    for (const item of itemsToCheckout) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          error: `"${product?.name ?? "A product"}" does not have enough stock.`,
        };
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          subtotalInPaise,
          shippingInPaise,
          discountInPaise,
          totalInPaise,
          shippingFullName: address.fullName,
          shippingPhone: address.phone,
          shippingAddressLine: address.addressLine,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          shippingCountry: address.country,
          items: {
            create: itemsToCheckout,
          },
        },
      });

      // Decrement stock for each ordered product
      await Promise.all(
        itemsToCheckout.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      if (cartIdToDelete) {
        await tx.cartItem.deleteMany({
          where: { cartId: cartIdToDelete },
        });
      } else if (buyNowProductId) {
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (cart) {
          await tx.cartItem.deleteMany({
            where: {
              cartId: cart.id,
              productId: buyNowProductId,
            },
          });
        }
      }

      return newOrder;
    });
    
    revalidatePath("/cart");
    orderId = order.id;
  } catch (error) {
    console.error("Place order error:", error);
    return {
      success: false,
      error: "Failed to place order. Please try again.",
    };
  }
  if (orderId) {
    redirect(`/checkout/success/${orderId}`);
  }
}
