export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace space, special characters to "-"
    .replace(/^-+|-+$/g, ""); // remove "-" from start and end
}
