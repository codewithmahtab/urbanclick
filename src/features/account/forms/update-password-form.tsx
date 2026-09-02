"use client";

import { useActionState, useRef, useEffect } from "react";
import { updatePasswordAction } from "@/features/account/actions/update-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

const initialState = undefined;

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <section className="space-y-4 border border-white/10 p-6 rounded-xl bg-white/5">
      <div>
        <h2 className="text-xl font-medium">Password</h2>
        <p className="text-sm text-muted-foreground">Change your account password.</p>
      </div>

      <form ref={formRef} action={action} className="space-y-4" spellCheck="false">
        <div className="space-y-2 max-w-md">
          <label htmlFor="currentPassword" className="text-sm">Current Password</label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            className="h-11 text-md! px-4"
            placeholder="••••••••"
          />
          {state?.fieldErrors?.currentPassword?.[0] && !pending && (
            <p className="text-red-500 text-sm">{state.fieldErrors.currentPassword[0]}</p>
          )}
        </div>

        <div className="space-y-2 max-w-md">
          <label htmlFor="newPassword" className="text-sm">New Password</label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            className="h-11 text-md! px-4"
            placeholder="••••••••"
          />
          {state?.fieldErrors?.newPassword?.[0] && !pending && (
            <p className="text-red-500 text-sm">{state.fieldErrors.newPassword[0]}</p>
          )}
        </div>

        <div className="space-y-2 max-w-md">
          <label htmlFor="confirmPassword" className="text-sm">Confirm New Password</label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="h-11 text-md! px-4"
            placeholder="••••••••"
          />
          {state?.fieldErrors?.confirmPassword?.[0] && !pending && (
            <p className="text-red-500 text-sm">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        {state?.formError && !pending && (
          <p className="text-red-500 text-sm">{state.formError}</p>
        )}
        
        {state?.success && !pending && (
          <p className="text-green-500 text-sm flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Password updated successfully.
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
            "Change Password"
          )}
        </Button>
      </form>
    </section>
  );
}
