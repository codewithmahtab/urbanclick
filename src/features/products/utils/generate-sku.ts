import crypto from "crypto";

export function generateSKU(productName: string): string {
  const namePart = productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 4)
    .toUpperCase();

  const prefix = namePart.length > 0 ? namePart : "PROD";

  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();

  return `${prefix}-${randomPart}`;
}
