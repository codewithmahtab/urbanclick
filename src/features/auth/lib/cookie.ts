import "server-only";

import { cookies } from "next/headers";

const COOKIE_NAME = "session";

export async function setCookie(cookie: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCookie() {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}
