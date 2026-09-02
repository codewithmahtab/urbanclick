"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import type { Address } from "@/features/addresses/types/address";
import { useState, useRef, useEffect } from "react";
import AddAddressModal from "@/features/addresses/components/add-address-modal";

interface AddressSelectionModalProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddressSelectionModal({
  addresses,
  selectedAddressId,
  onSelect,
  isOpen,
  onOpenChange,
}: AddressSelectionModalProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      // Small timeout to let the dialog animation start and DOM to settle
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 10);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden">
          <div 
            ref={scrollRef}
            className="p-6 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <DialogHeader className="pb-4 border-b">
              <DialogTitle 
                className="flex items-center gap-2 text-xl font-bold outline-none"
                tabIndex={0}
              >
                <MapPin className="h-5 w-5 text-yellow-500" />
                Select Delivery Address
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
              Choose an address for this order or add a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`relative rounded-xl border p-5 cursor-pointer transition-all ${
                  selectedAddressId === address.id
                    ? "border-yellow-400 bg-yellow-400/5 ring-1 ring-yellow-400"
                    : "border-border hover:border-white/40"
                }`}
                onClick={() => {
                  onSelect(address.id);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary">
                    {selectedAddressId === address.id && (
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-base">
                        {address.fullName}
                      </p>
                      {address.isDefault && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {address.phone}
                    </p>
                    <p className="text-sm mt-2 leading-relaxed">
                      {address.addressLine}, {address.city}, {address.state} –{" "}
                      {address.pincode}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full h-14 border-dashed rounded-xl hover:border-yellow-400 hover:text-yellow-500 transition-colors"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => setIsAddModalOpen(true), 150);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddAddressModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </>
  );
}
