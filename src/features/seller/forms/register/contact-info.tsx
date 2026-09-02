import { Input } from "@/components/ui/input";
import { SellerRegisterFormState } from "@/features/seller/schemas/register.schema";

export default function ContactInfo({
  state,
}: {
  state: SellerRegisterFormState;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Contact Information</h2>

      <div className="space-y-2">
        <label htmlFor="phone">Phone</label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          className="h-12 text-md! px-4"
          placeholder="9876543210"
        />

        {state?.fieldErrors?.phone?.[0] && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.phone[0]}
          </p>
        )}
      </div>
    </div>
  );
}
