import { Input } from "@/components/ui/input";
import { SellerRegisterFormState } from "@/features/seller/schemas/register.schema";

export default function PickupAddress({
  state,
}: {
  state: SellerRegisterFormState;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Pickup Address</h2>

      <div className="space-y-2">
        <label htmlFor="addressLine">Address</label>

        <Input
          id="addressLine"
          name="addressLine"
          type="text"
          className="h-12 text-md! px-4"
          placeholder="123 Main Street"
        />

        {state?.fieldErrors?.addressLine?.[0] && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.addressLine[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city">City</label>

          <Input
            id="city"
            name="city"
            type="text"
            className="h-12 text-md! px-4"
            placeholder="Delhi"
          />

          {state?.fieldErrors?.city?.[0] && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.city[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="state">State</label>

          <Input
            id="state"
            name="state"
            type="text"
            className="h-12 text-md! px-4"
            placeholder="Delhi"
          />

          {state?.fieldErrors?.state?.[0] && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.state[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="pincode">Pincode</label>

          <Input
            id="pincode"
            name="pincode"
            type="text"
            inputMode="numeric"
            className="h-12 text-md! px-4"
            placeholder="110001"
          />

          {state?.fieldErrors?.pincode?.[0] && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.pincode[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="country">Country</label>

          <Input
            id="country"
            name="country"
            value="India"
            readOnly
            className="h-12 text-md! px-4"
          />
        </div>
      </div>
    </div>
  );
}
