"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSellerSettings } from "@/features/seller/actions/update-settings";
import type { SellerSettingsState } from "@/features/seller/schemas/settings.schema";
import { CheckCircle } from "lucide-react";

interface SellerSettingsFormProps {
  seller: {
    storeName: string;
    description: string | null;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string | null;
    pan: string | null;
  };
}

const initialState: SellerSettingsState = undefined;

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive mt-1">{errors[0]}</p>;
}

export function SellerSettingsForm({ seller }: SellerSettingsFormProps) {
  const [state, action, pending] = useActionState(updateSellerSettings, initialState);

  return (
    <form action={action} className="space-y-8" spellCheck="false">
      {/* Business Info */}
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Business Information</h2>

        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            name="storeName"
            defaultValue={seller.storeName}
            placeholder="Your store name"
          />
          <FieldError errors={state?.fieldErrors?.storeName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description{" "}
            <span className="text-muted-foreground text-xs font-normal">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={seller.description ?? ""}
            placeholder="Tell customers about your store..."
            rows={3}
          />
          <FieldError errors={state?.fieldErrors?.description} />
        </div>
      </section>

      {/* Contact Info */}
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Contact Information</h2>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={seller.phone}
            placeholder="10-digit mobile number"
          />
          <FieldError errors={state?.fieldErrors?.phone} />
        </div>
      </section>

      {/* Pickup Address */}
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Pickup / Warehouse Address</h2>

        <div className="space-y-2">
          <Label htmlFor="addressLine">Address</Label>
          <Input
            id="addressLine"
            name="addressLine"
            defaultValue={seller.addressLine}
            placeholder="Street address"
          />
          <FieldError errors={state?.fieldErrors?.addressLine} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={seller.city} placeholder="City" />
            <FieldError errors={state?.fieldErrors?.city} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" defaultValue={seller.state} placeholder="State" />
            <FieldError errors={state?.fieldErrors?.state} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            name="pincode"
            defaultValue={seller.pincode}
            placeholder="6-digit pincode"
            className="max-w-[160px]"
          />
          <FieldError errors={state?.fieldErrors?.pincode} />
        </div>
      </section>

      {/* Tax Info */}
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Tax Information{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </h2>

        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input
            id="gstin"
            name="gstin"
            defaultValue={seller.gstin ?? ""}
            placeholder="GST Identification Number"
          />
          <FieldError errors={state?.fieldErrors?.gstin} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pan">PAN</Label>
          <Input
            id="pan"
            name="pan"
            defaultValue={seller.pan ?? ""}
            placeholder="PAN Number"
            className="uppercase"
          />
          <FieldError errors={state?.fieldErrors?.pan} />
        </div>
      </section>

      {state?.formError && (
        <p className="text-sm text-destructive">{state.formError}</p>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <Button type="submit" disabled={pending} className="h-11 px-8">
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
