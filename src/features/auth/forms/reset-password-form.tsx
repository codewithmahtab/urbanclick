"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/features/auth/actions/reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const initialState = undefined;

export default function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, initialState);
  const searchParam = useSearchParams();
  const token = searchParam.get("token") || "";

  return (
    <section className="w-full max-w-lg space-y-6 border border-white/30 p-10 rounded-2xl mt-10">
      <h1 className="text-3xl font-semibold">Set New Password</h1>
      <p className="text-muted-foreground text-sm">
        Please enter and confirm your new password.
      </p>

      <form action={action} className="space-y-4" spellCheck="false">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
          <label htmlFor="password">New Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            className="h-12 text-md! px-4"
            placeholder="••••••••"
          />
          {state?.fieldErrors?.password?.[0] && (
            <p className="text-red-500 text-sm">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="h-12 text-md! px-4"
            placeholder="••••••••"
          />
          {state?.fieldErrors?.confirmPassword?.[0] && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>

        {state?.formError && (
          <p className="text-red-500 text-sm">{state.formError}</p>
        )}

        <Button
          disabled={pending || !token}
          type="submit"
          className="w-full h-12 cursor-pointer mt-5"
        >
          {pending ? (
            <>
              Saving
              <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </section>
  );
}
