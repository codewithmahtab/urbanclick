"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/features/auth/actions/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const initialState = undefined;

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <section className="w-full max-w-lg space-y-6 border border-white/30 p-10 rounded-2xl mt-10">
      <h1 className="text-3xl font-semibold">Forgot Password</h1>
      <p className="text-muted-foreground text-sm">
        Enter your email address and we will send you a code to reset your password.
      </p>

      <form action={action} className="space-y-4" spellCheck="false">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            className="h-12 text-md! px-4"
            placeholder="xyz@example.com"
          />
          {state?.fieldErrors?.email?.[0] && (
            <p className="text-red-500 text-sm">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        {state?.formError && (
          <p className="text-red-500 text-sm">{state.formError}</p>
        )}

        <Button
          disabled={pending}
          type="submit"
          className="w-full h-12 cursor-pointer mt-5"
        >
          {pending ? (
            <>
              Sending
              <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </>
          ) : (
            "Send Reset Code"
          )}
        </Button>

        <p className="text-center text-muted-foreground mt-4">
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-medium">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}
