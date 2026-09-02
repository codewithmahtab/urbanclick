"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAsGuest } from "@/features/seller/actions/login-as-guest";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LogOut, LogIn, CheckCircle2, AlertCircle } from "lucide-react";

type Stage = "confirm" | "loading" | "done" | "error";

interface Step {
  icon: React.ReactNode;
  label: string;
  done: boolean;
  active: boolean;
}

interface GuestLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function GuestLoginModal({ open, onClose }: GuestLoginModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<Stage>("confirm");
  const [loadingStep, setLoadingStep] = useState<0 | 1>(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStage("confirm");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingStep(0);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMsg("");
    }
  }, [open]);

  function handleStart() {
    setStage("loading");
    setLoadingStep(0);

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 900));
      setLoadingStep(1);

      try {
        await loginAsGuest();
        setStage("done");

        await new Promise((r) => setTimeout(r, 1000));
        router.push("/seller");
        router.refresh();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
        setStage("error");
      }
    });
  }

  const steps: Step[] = [
    {
      icon: <LogOut className="size-4" />,
      label: "Signing out your account",
      done: loadingStep > 0 || stage === "done",
      active: loadingStep === 0 && stage === "loading",
    },
    {
      icon: <LogIn className="size-4" />,
      label: "Logging in as guest seller",
      done: stage === "done",
      active: loadingStep === 1 && stage === "loading",
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !isPending && stage !== "loading") onClose();
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-white/10 bg-card gap-0">
        <div className="relative px-8 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
              <LogIn className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">Log in as Guest</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Explore the seller dashboard instantly</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {stage === "confirm" && (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We&apos;ll sign you out of your current account and log you in with a
                pre-approved guest seller account so you can browse the dashboard right away.
              </p>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300 leading-relaxed">
                <span className="font-medium text-amber-200">Note:</span> This will end your
                current session. You can log back in anytime.
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 h-10 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStart}
                  className="flex-1 h-10 rounded-lg bg-amber-500 text-sm font-medium text-black hover:bg-amber-400 transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </>
          )}

          {stage === "loading" && (
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={[
                      "flex size-9 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-500",
                      step.done
                        ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
                        : step.active
                          ? "bg-amber-500/15 text-amber-400 ring-amber-500/30"
                          : "bg-white/5 text-muted-foreground ring-white/10",
                    ].join(" ")}
                  >
                    {step.done ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : step.active ? (
                      <span className="size-4 flex items-center justify-center">
                        <span className="size-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin block" />
                      </span>
                    ) : (
                      step.icon
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={[
                        "text-sm font-medium transition-colors duration-300",
                        step.done
                          ? "text-emerald-400"
                          : step.active
                            ? "text-foreground"
                            : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {step.label}
                    </p>
                  </div>

                  {step.done && (
                    <span className="text-xs text-emerald-400 font-medium shrink-0">Done</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {stage === "done" && (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="size-7 text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-foreground">Logged in successfully</p>
              <p className="text-xs text-muted-foreground">Redirecting to your seller dashboard…</p>
              <div className="mt-1 h-1 w-32 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full animate-[progress_1s_ease-in-out_forwards]" />
              </div>
            </div>
          )}

          {stage === "error" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
                  <AlertCircle className="size-7 text-red-400" />
                </div>
                <p className="text-sm font-medium text-foreground">Something went wrong</p>
                <p className="text-xs text-muted-foreground max-w-xs">{errorMsg}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full h-10 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
