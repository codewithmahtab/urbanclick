"use server";

import { createSession } from "@/features/auth/lib/session";
import { prisma } from "@/lib/prisma";
import { FormState, LoginFormSchema } from "@/features/auth/validations/login";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import z from "zod";

export async function login(_prevState: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  
  const localCartRaw = formData.get("localCart")?.toString();
  let localCart: { productId: string; quantity: number }[] = [];
  try {
    if (localCartRaw) {
      localCart = JSON.parse(localCartRaw);
    }
  } catch (e) {
    // Ignore invalid JSON
  }

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      fieldErrors: fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const redirectTo = formData.get("redirectTo")?.toString() || "/";

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        isVerified: true,
      },
    });

    if (!user) {
      return {
        formError: "Invalid email or password",
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        formError: "Invalid email or password",
      };
    }

    await createSession(user.id, user.isVerified);

    if (localCart.length > 0) {
      // Merge local cart into database cart
      // Find or create cart for user
      let userCart = await prisma.cart.findUnique({
        where: { userId: user.id },
      });
      if (!userCart) {
        userCart = await prisma.cart.create({ data: { userId: user.id } });
      }

      for (const item of localCart) {
        const existingItem = await prisma.cartItem.findUnique({
          where: {
            cartId_productId: {
              cartId: userCart.id,
              productId: item.productId,
            },
          },
        });

        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }
    }

    if (!user.isVerified) {
      redirect(`/verify-email?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  } catch (error) {
    console.log(error);
    return {
      formError: "Something went wrong. Please try again later",
    };
  }

  redirect(redirectTo);
}
