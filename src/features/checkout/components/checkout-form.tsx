"use client";

import { useActionState, useState, useEffect } from "react";
import { placeOrderAction } from "../actions/place-order";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";
import type { Address } from "@/features/addresses/types/address";
import AddressSelectionModal from "./address-selection-modal";
import AddAddressModal from "@/features/addresses/components/add-address-modal";

interface CheckoutFormProps {
  addresses: Address[];
  buyNowParams?: {
    productId: string;
    quantity: number;
  };
}

export default function CheckoutForm({ addresses, buyNowParams }: CheckoutFormProps) {
  const [state, action, isPending] = useActionState(placeOrderAction, {
    success: false,
    error: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null,
  );
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(
        addresses.find((a) => a.isDefault)?.id || addresses[0].id,
      );
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <>
      <form action={action} className="space-y-8">
        {buyNowParams && (
          <>
            <input type="hidden" name="buyNowProductId" value={buyNowParams.productId} />
            <input type="hidden" name="buyNowQuantity" value={buyNowParams.quantity} />
          </>
        )}
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>

          {selectedAddress ? (
            <div className="rounded-2xl border p-6 bg-card relative">
              <input
                type="hidden"
                name="addressId"
                value={selectedAddress.id}
              />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">
                        {selectedAddress.fullName}
                      </p>
                      {selectedAddress.isDefault && (
                        <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-medium text-black">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedAddress.phone}
                    </p>
                    <p className="text-sm mt-2 leading-relaxed">
                      {selectedAddress.addressLine}, {selectedAddress.city},{" "}
                      {selectedAddress.state} – {selectedAddress.pincode}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelectionModalOpen(true)}
                  className="rounded-full"
                >
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed p-8 text-center bg-card/50">
              <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Address Found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Please add a delivery address to proceed with your checkout.
              </p>
              <Button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 font-medium"
              >
                Add Delivery Address
              </Button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
          <div className="rounded-xl border p-4 bg-muted/50">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="cod"
                name="payment"
                value="cod"
                defaultChecked
                className="w-4 h-4"
              />
              <Label htmlFor="cod" className="font-medium cursor-pointer">
                Cash on Delivery (COD)
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-7">
              Pay with cash upon delivery. No card required.
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="text-destructive font-medium rounded-xl text-sm">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-14 text-lg bg-yellow-400 text-black hover:bg-yellow-500 rounded-full"
          disabled={isPending || !selectedAddress}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Placing Order...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </form>

      <AddressSelectionModal
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={setSelectedAddressId}
        isOpen={isSelectionModalOpen}
        onOpenChange={setIsSelectionModalOpen}
      />

      <AddAddressModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </>
  );
}
