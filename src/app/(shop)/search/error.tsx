"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section className="space-y-6 text-center p-10">
      <h2 className="text-2xl font-semibold">Error Loading Products</h2>

      <p>Error Message: {error.message}</p>

      <Button onClick={retry} size="lg">
        Try Again
      </Button>
    </section>
  );
}
