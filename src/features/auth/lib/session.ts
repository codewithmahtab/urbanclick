import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createToken, verifyToken } from "./token";
import { deleteCookie, getCookie, setCookie } from "./cookie";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const SESSION_REFRESH_THRESHOLD = 24 * 60 * 60 * 1000;

function shouldRefreshSession(expiresAt: Date) {
  return expiresAt.getTime() - Date.now() <= SESSION_REFRESH_THRESHOLD;
}

export async function createSession(userId: string, isVerified: boolean = false) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const dbSession = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
    select: {
      id: true,
    },
  });

  const token = await createToken({
    sessionId: dbSession.id,
    isVerified,
  });

  await setCookie(token, expiresAt);
}

export const getSession = cache(async () => {
  const token = await getCookie();

  const payload = await verifyToken(token);

  if (!payload?.sessionId) {
    return null;
  }
  const session = await prisma.session.findUnique({
    where: {
      id: payload.sessionId,
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return {
    ...session,
    isVerified: payload.isVerified,
  };
});

export async function deleteSession() {
  const cookie = await getCookie();

  if (cookie) {
    const payload = await verifyToken(cookie);

    if (payload?.sessionId) {
      await prisma.session.deleteMany({
        where: {
          id: payload.sessionId,
        },
      });
    }
  }

  await deleteCookie();
}

export async function updateSession() {
  const cookie = await getCookie();

  const payload = await verifyToken(cookie);

  if (!payload?.sessionId) {
    return null;
  }

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const session = await prisma.session.updateMany({
    where: {
      id: payload.sessionId,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      expiresAt,
    },
  });

  if (session.count === 0) {
    await deleteCookie();
    return null;
  }

  const newCookie = await createToken({
    sessionId: payload.sessionId,
    isVerified: payload.isVerified,
  });

  await setCookie(newCookie, expiresAt);

  return {
    sessionId: payload.sessionId,
    expiresAt,
  };
}
