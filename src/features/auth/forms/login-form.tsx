"use client";

import { login } from "@/features/auth/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, UserRound } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";

const GUEST_EMAIL = "reachmohdmahtab@gmail.com";
const GUEST_PASSWORD = "mahtab@12345";

const initialState = undefined;

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  const searchParam = useSearchParams();

  const redirectTo = searchParam.get("redirectTo") || "/";

  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleGuestLogin() {
    if (emailRef.current) emailRef.current.value = GUEST_EMAIL;
    if (passwordRef.current) passwordRef.current.value = GUEST_PASSWORD;
    formRef.current?.requestSubmit();
  }

  return (
    <section className="w-full max-w-lg space-y-6 border border-white/30 p-6 sm:p-10 rounded-2xl mt-10">
      <h1 className="text-3xl font-semibold">Login</h1>

      <form ref={formRef} action={action} className="space-y-3" spellCheck="false">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {isMounted && (
          <input type="hidden" name="localCart" value={JSON.stringify(cartItems)} />
        )}

        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input
            ref={emailRef}
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
            ref={passwordRef}
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
        {state?.formError && (
          <p className="text-red-500 text-sm">{state.formError}</p>
        )}

        <div className="flex justify-end mt-1">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          disabled={pending}
          type="submit"
          className="w-full h-12 cursor-pointer mt-5"
        >
          {pending ? (
            <>
              Logging in
              <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </>
          ) : (
            "Log in"
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Guest Login Button */}
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={handleGuestLogin}
          className="w-full h-12 cursor-pointer border-white/20 hover:bg-white/5 gap-2"
        >
          <UserRound className="w-4 h-4" />
          Continue as Guest
        </Button>

        <p className="text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="text-primary font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}
