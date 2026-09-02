"use client";

import { useActionState, useEffect, useState } from "react";
import { editAddressAction } from "../actions/edit-address";
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
import type { Address } from "../types/address";

interface EditAddressModalProps {
  address: Address;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditAddressModal({
  address,
  isOpen,
  onOpenChange,
}: EditAddressModalProps) {
  const [state, formAction, isPending] = useActionState(
    editAddressAction,
    undefined,
  );

  const [fields, setFields] = useState({
    fullName: address.fullName,
    phone: address.phone,
    addressLine: address.addressLine,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
  });

  useEffect(() => {
    setFields({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    });
  }, [address]);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  const handleChange =
    (field: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <MapPin className="h-5 w-5 text-yellow-500" />
            Edit Address
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update your saved delivery address.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 mt-2">
          <input type="hidden" name="addressId" value={address.id} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                name="fullName"
                value={fields.fullName}
                onChange={handleChange("fullName")}
                placeholder="Jane Doe"
              />
              {state?.fieldErrors?.fullName?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.fullName[0]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={fields.phone}
                onChange={handleChange("phone")}
                placeholder="+91 9876543210"
              />
              {state?.fieldErrors?.phone?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.phone[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-addressLine">Address</Label>
            <Input
              id="edit-addressLine"
              name="addressLine"
              value={fields.addressLine}
              onChange={handleChange("addressLine")}
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
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                name="city"
                value={fields.city}
                onChange={handleChange("city")}
                placeholder="Mumbai"
              />
              {state?.fieldErrors?.city?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.city[0]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-state">State</Label>
              <Input
                id="edit-state"
                name="state"
                value={fields.state}
                onChange={handleChange("state")}
                placeholder="Maharashtra"
              />
              {state?.fieldErrors?.state?.[0] && (
                <p className="text-red-500 text-sm">
                  {state.fieldErrors.state[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-pincode">PIN Code</Label>
              <Input
                id="edit-pincode"
                name="pincode"
                value={fields.pincode}
                onChange={handleChange("pincode")}
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
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                name="country"
                value={fields.country}
                onChange={handleChange("country")}
                placeholder="India"
              />
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
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
