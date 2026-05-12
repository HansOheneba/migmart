"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { verifyAdminPassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const initialState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    verifyAdminPassword,
    initialState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--sand-200) px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--green-900)">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-heading text-2xl text-(--ink-900)">Admin Access</h1>
          <p className="text-sm text-(--ink-500)">
            Enter the admin password to continue.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-(--ink-700)"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          {state.error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Verifying…" : "Enter Admin"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
