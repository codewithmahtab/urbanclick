"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { registerSeller } from "@/features/seller/actions/register";
import { useActionState } from "react";
import BusinessInfo from "./business-info";
import ContactInfo from "./contact-info";
import PickupAddress from "./pickup-address";
import TaxInfo from "./tax-info";
import { GuestLoginModal } from "@/features/seller/components/modals/guest-login-modal";

const initialState = undefined;

export default function SellerRegisterForm() {
  const [state, action, pending] = useActionState(registerSeller, initialState);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Guest access banner */}
      <div className="w-full max-w-2xl mx-auto mt-10 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-300">
        <span className="mt-0.5 text-base">👀</span>
        <p className="leading-relaxed">
          <span className="font-medium text-amber-200">Just browsing?</span>{" "}
          Use our guest account to explore the seller dashboard without signing
          up.{" "}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1 font-semibold text-amber-200 underline underline-offset-4 hover:text-white transition-colors"
          >
            Log in as guest →
          </button>
        </p>
      </div>

      {/* Register form */}
      <section className="w-full max-w-2xl mx-auto space-y-6 border border-white/30 p-6 sm:p-10 rounded-2xl my-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Become a Seller</h1>

          <p className="text-muted-foreground">
            Create your seller account and start selling on Next Shop.
          </p>
        </div>

        <form action={action} className="space-y-6" spellCheck="false">
          <BusinessInfo state={state} />
          <ContactInfo state={state} />
          <PickupAddress state={state} />
          <TaxInfo state={state} />

          {state?.formError && (
            <p className="text-red-500 text-sm">{state.formError}</p>
          )}

          <Button
            disabled={pending}
            type="submit"
            className="w-full h-12 cursor-pointer"
          >
            {pending ? "Submitting..." : "Submit Seller Application"}
          </Button>
        </form>
      </section>

      {/* Guest login modal */}
      <GuestLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
