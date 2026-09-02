import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface EmptyAddressesProps {
  onAdd: () => void;
}

export default function EmptyAddresses({ onAdd }: EmptyAddressesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-6">
        <MapPin className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No saved addresses</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        You haven&apos;t added any delivery addresses yet. Add one to speed up
        your checkout experience.
      </p>
      <Button
        onClick={onAdd}
        className="rounded-full bg-yellow-400 h-12 px-8 text-black hover:bg-yellow-500 font-medium"
      >
        Add Your First Address
      </Button>
    </div>
  );
}
