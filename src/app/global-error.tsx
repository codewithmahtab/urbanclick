"use client";

import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-background text-foreground">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-destructive">
            Critical Error
          </h2>
          <p className="mb-8 text-muted-foreground max-w-md">
            A fatal error occurred at the application level.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => retry()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
