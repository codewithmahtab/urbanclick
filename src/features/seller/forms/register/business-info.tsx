import { Input } from "@/components/ui/input";
import { SellerRegisterFormState } from "@/features/seller/schemas/register.schema";

export default function BusinessInfo({
  state,
}: {
  state: SellerRegisterFormState;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Business Information</h2>

      <div className="space-y-2">
        <label htmlFor="storeName">Store Name</label>

        <Input
          id="storeName"
          name="storeName"
          type="text"
          className="h-12 text-md! px-4"
          placeholder="Rahul Electronics"
        />

        {state?.fieldErrors?.storeName?.[0] && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.storeName[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Store Description</label>

        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full rounded-md border bg-transparent px-4 py-3 text-sm outline-none"
          placeholder="Tell customers about your store..."
        />

        {state?.fieldErrors?.description?.[0] && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>
    </div>
  );
}
