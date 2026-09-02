import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PendingState() {
  return (
    <section className="w-full max-w-lg mx-auto space-y-6 border border-white/30 p-10 rounded-2xl my-10 text-center">
      <h1 className="text-3xl font-semibold">Application Submitted</h1>

      <p className="text-muted-foreground">
        Your seller application has been submitted successfully.
      </p>

      <p className="text-muted-foreground">
        An administrator will review your application. Once approved, you&apos;ll be
        able to access your seller dashboard.
      </p>

      <Button size="lg" render={<Link href="/" />} className="h-13 px-4">
        Continue Shopping
      </Button>
    </section>
  );
}
