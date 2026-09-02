"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtpAction } from "@/features/auth/actions/verify-otp";
import { resendVerificationOtpAction } from "@/features/auth/actions/resend-verification-otp";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Mail, Loader2 } from "lucide-react";

const initialState = undefined;
const RESEND_COOLDOWN_SEC = 60;
const STORAGE_KEY = "otp_timer_email_verification";

export default function VerifyEmailForm({ email = "" }: { email?: string }) {
  const [state, action, pending] = useActionState(
    verifyOtpAction,
    initialState,
  );
  
  const searchParam = useSearchParams();
  const router = useRouter();
  
  const redirectTo = searchParam.get("redirectTo") || "/";
  const sent = searchParam.get("sent") === "true";

  const [timeLeft, setTimeLeft] = useState(0);
  const [isResending, startResendTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize and persist timer
  useEffect(() => {
    setIsMounted(true);
    let endTime = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);

    if (sent) {
      endTime = Date.now() + RESEND_COOLDOWN_SEC * 1000;
      localStorage.setItem(STORAGE_KEY, endTime.toString());
      
      const params = new URLSearchParams(searchParam.toString());
      params.delete("sent");
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sent, searchParam, router]);

  const handleResend = () => {
    startResendTransition(async () => {
      await resendVerificationOtpAction();
    });
  };

  return (
    <section className="w-full max-w-lg space-y-6 border border-white/30 p-10 rounded-2xl mt-10 text-center">
      <h1 className="text-3xl font-semibold">Verify your email</h1>
      <div className="flex flex-col items-center justify-center space-y-3">
        <p className="text-muted-foreground text-sm">
          We have sent a 6-digit verification code to
        </p>
        {email ? (
          <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-white/10">
            <Mail className="w-4 h-4 mr-2 text-primary" />
            <span className="text-white/90">{email}</span>
          </div>
        ) : (
          <p className="text-sm font-medium text-white">your email address</p>
        )}
      </div>

      <form action={action} className="space-y-6 flex flex-col items-center">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <InputOTP maxLength={6} name="otp" required>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
            <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
            <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
            <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
            <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
            <InputOTPSlot index={5} className="w-12 h-14 text-lg" />
          </InputOTPGroup>
        </InputOTP>

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

        <Button
          disabled={pending}
          type="submit"
          className="w-full h-12 cursor-pointer mt-5"
        >
          {pending ? (
            <>
              Verifying
              <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-white/10 mt-4 min-h-[40px] flex items-center justify-center">
        {!isMounted ? null : timeLeft > 0 ? (
          <p className="text-sm text-muted-foreground">
            You can resend the code in <span className="font-medium text-white">{timeLeft}s</span>
          </p>
        ) : (
          <Button
            variant="ghost"
            className="text-sm text-primary hover:text-primary/80 h-auto p-0"
            disabled={isResending}
            onClick={handleResend}
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </Button>
        )}
      </div>
    </section>
  );
}
