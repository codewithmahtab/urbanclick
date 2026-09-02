import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-white/10 rounded-2xl bg-white/5">
      <div className="bg-white/10 p-4 rounded-full mb-6">
        <PackageOpen className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Looks like you haven't placed any orders yet. Start shopping to fill this space!
      </p>
      <Link href="/">
        <Button className="h-12 px-8">Start Shopping</Button>
      </Link>
    </div>
  );
}
