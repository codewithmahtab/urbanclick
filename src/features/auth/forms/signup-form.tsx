"use client";

import { signup } from "@/features/auth/actions/signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

const initialState = undefined;

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, initialState);
  const searchParam = useSearchParams();

  const redirectTo = searchParam.get("redirectTo") || "/";

  return (
    <section className="w-full max-w-lg space-y-6 border border-white/30 p-6 sm:p-10 rounded-2xl mt-10">
      <h1 className="text-3xl font-semibold">Create Account</h1>

      <form action={action} className="space-y-3" spellCheck="false">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            name="name"
            type="text"
            className="h-12 text-md! px-4"
            placeholder="John Snow"
          />
          {state?.fieldErrors?.name?.[0] && (
            <p className="text-red-500 text-sm">{state.fieldErrors.name[0]}</p>
          )}
        </div>
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
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            className="h-12 text-md! px-4"
            placeholder="••••••••"
          />
          {state?.fieldErrors?.password?.[0] && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
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
          disabled={pending}
          type="submit"
          className="w-full h-12 cursor-pointer mt-5"
        >
          {pending ? (
            <>
              Creating Account
              <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="text-primary font-medium"
          >
            log in
          </Link>
        </p>
      </form>
    </section>
  );
}
