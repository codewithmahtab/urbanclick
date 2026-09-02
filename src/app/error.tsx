"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="mb-8 text-muted-foreground max-w-md">
        An unexpected error has occurred while trying to process your request.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => retry()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
      </div>
    </div>
  );
}
