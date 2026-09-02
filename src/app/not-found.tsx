import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h2 className="mb-4 text-7xl font-bold tracking-tight text-primary">
        404
      </h2>
      <h3 className="mb-2 text-2xl font-semibold">Page Not Found</h3>
      <p className="mb-8 text-muted-foreground max-w-md">
        Oops! The page you are looking for doesn&apos;t exist, has been moved, or is
        temporarily unavailable.
      </p>
      <Button render={<Link href="/" />} size="lg">
        Return to Homepage
      </Button>
    </div>
  );
}
