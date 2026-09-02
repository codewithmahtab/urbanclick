import "server-only";

import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined");
}

const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  sessionId: string;
  isVerified: boolean;
};

export async function createToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifyToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sessionId !== "string" ||
      typeof payload.isVerified !== "boolean" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    return {
      sessionId: payload.sessionId,
      isVerified: payload.isVerified,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch {
    return null;
  }
}
