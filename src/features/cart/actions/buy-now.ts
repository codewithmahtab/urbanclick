"use server";

import { redirect } from "next/navigation";
import { addToCartAction } from "./add-to-cart";

export async function buyNowAction(productId: string, quantity: number) {
  await addToCartAction(productId, quantity);
  redirect(`/checkout?productId=${productId}&quantity=${quantity}`);
}
