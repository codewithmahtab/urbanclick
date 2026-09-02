import { Input } from "@/components/ui/input";
import { SellerRegisterFormState } from "@/features/seller/schemas/register.schema";

export default function TaxInfo({
  state,
}: {
  state: SellerRegisterFormState;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Tax Information</h2>

      <div className="space-y-2">
        <label htmlFor="gstin">
          GSTIN <span className="text-muted-foreground">(optional)</span>
        </label>

        <Input
          id="gstin"
          name="gstin"
          type="text"
          className="h-12 text-md! px-4 uppercase"
          placeholder="22AAAAA0000A1Z5"
        />

        {state?.fieldErrors?.gstin?.[0] && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.gstin[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="pan">
          PAN <span className="text-muted-foreground">(optional)</span>
        </label>

        <Input
          id="pan"
          name="pan"
          type="text"
          className="h-12 text-md! px-4 uppercase"
          placeholder="ABCDE1234F"
        />

        {state?.fieldErrors?.pan?.[0] && (
          <p className="text-red-500 text-sm">{state.fieldErrors.pan[0]}</p>
        )}
      </div>
    </div>
  );
}
