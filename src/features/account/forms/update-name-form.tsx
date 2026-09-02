"use client";

import { useActionState, useEffect } from "react";
import { updateNameAction } from "@/features/account/actions/update-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

const initialState = undefined;

export function UpdateNameForm({ currentName }: { currentName: string }) {
  const [state, action, pending] = useActionState(updateNameAction, initialState);

  return (
    <section className="space-y-4 border border-white/10 p-6 rounded-xl bg-white/5">
      <div>
        <h2 className="text-xl font-medium">Name</h2>
        <p className="text-sm text-muted-foreground">Update your full name.</p>
      </div>

      <form action={action} className="space-y-4" spellCheck="false">
        <div className="space-y-2">
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={currentName}
            className="h-11 text-md! px-4 max-w-md"
            placeholder="John Doe"
          />
          {state?.fieldErrors?.name?.[0] && !pending && (
            <p className="text-red-500 text-sm">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        {state?.formError && !pending && (
          <p className="text-red-500 text-sm">{state.formError}</p>
        )}
        
        {state?.success && !pending && (
          <p className="text-green-500 text-sm flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Name updated successfully.
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
