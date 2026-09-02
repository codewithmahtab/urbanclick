"use client";

import { useActionState, useEffect } from "react";
import { addAddressAction } from "../actions/add-address";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";

interface AddAddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAddressModal({
  isOpen,
  onOpenChange,
}: AddAddressModalProps) {
  const [state, formAction, isPending] = useActionState(
    addAddressAction,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state?.success, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <MapPin className="h-5 w-5 text-yellow-500" />
            Add New Address
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This address will be saved to your account for future checkouts.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" placeholder="Jane Doe" />
              {state?.fieldErrors?.fullName?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.fullName[0]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+91 9876543210" />
              {state?.fieldErrors?.phone?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.phone[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine">Address</Label>
            <Input
              id="addressLine"
              name="addressLine"
              placeholder="House no., Street, Area"
            />
            {state?.fieldErrors?.addressLine?.[0] && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.addressLine[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="Mumbai" />
              {state?.fieldErrors?.city?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.city[0]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" placeholder="Maharashtra" />
              {state?.fieldErrors?.state?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.state[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pincode">PIN Code</Label>
              <Input
                id="pincode"
                name="pincode"
                placeholder="400001"
                maxLength={6}
              />
              {state?.fieldErrors?.pincode?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.pincode[0]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue="India" />
              {state?.fieldErrors?.country?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.country[0]}
                </p>
              )}
            </div>
          </div>

          {state?.formError && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-medium">
              {state.formError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full h-12"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
