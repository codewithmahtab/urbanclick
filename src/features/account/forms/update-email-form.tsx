"use client";

import { useActionState, useState, useEffect } from "react";
import { updateEmailAction } from "@/features/account/actions/update-email";
import { verifyUpdateEmailAction } from "@/features/account/actions/verify-update-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const initialState = undefined;

export function UpdateEmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState(updateEmailAction, initialState);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyUpdateEmailAction, initialState);
  
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (state?.requiresVerification) {
      setIsVerifying(true);
    }
  }, [state]);

  useEffect(() => {
    if (verifyState?.success) {
      setIsVerifying(false);
    }
  }, [verifyState?.success]);

  if (isVerifying) {
    return (
      <section className="space-y-4 border border-white/10 p-6 rounded-xl bg-white/5">
        <div>
          <h2 className="text-xl font-medium">Verify New Email</h2>
          <p className="text-sm text-muted-foreground">We sent a verification code to your new email address. Please enter it below.</p>
        </div>

        <form action={verifyAction} className="space-y-4">
          <div className="flex justify-start py-4">
            <InputOTP maxLength={6} name="otp">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {verifyState?.error && (
            <p className="text-red-500 text-sm text-start">{verifyState.error}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => setIsVerifying(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={verifyPending}
              type="submit"
              className="h-11"
            >
              {verifyPending ? (
                <>
                  Verifying
                  <Loader2 className="ml-1 w-4 h-4 animate-spin" />
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-4 border border-white/10 p-6 rounded-xl bg-white/5">
      <div>
        <h2 className="text-xl font-medium">Email Address</h2>
        <p className="text-sm text-muted-foreground">Update the email address associated with your account.</p>
      </div>

      <form action={action} className="space-y-4" spellCheck="false">
        <div className="space-y-2">
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={currentEmail}
            className="h-11 text-md! px-4 max-w-md"
            placeholder="xyz@example.com"
          />
          {state?.fieldErrors?.email?.[0] && !pending && (
            <p className="text-red-500 text-sm">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        {state?.formError && !pending && (
          <p className="text-red-500 text-sm">{state.formError}</p>
        )}
        
        {verifyState?.success && !state?.fieldErrors && !state?.formError && !pending && (
          <p className="text-green-500 text-sm flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Email updated successfully.
          </p>
        )}

        <Button
          disabled={pending}
          type="submit"
          className="h-11 cursor-pointer"
        >
          {pending ? (
            <>
              Saving
              <Loader2 className="ml-1 w-4 h-4 animate-spin" />
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </section>
  );
}
