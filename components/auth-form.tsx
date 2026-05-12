"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingBasket } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

const AVATARS = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
];

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();
    setLoading(true);

    try {
      if (!acceptedTerms) {
        throw new Error("Please accept the terms and privacy policy.");
      }

      if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });

        if (error) throw error;
        toast.success("Account created. Complete onboarding next.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Unable to load user session.");

      await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          display_name:
            displayName ||
            (user.user_metadata?.display_name as string | undefined) ||
            email.split("@")[0],
        },
        { onConflict: "user_id" },
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();

      router.replace(profile?.onboarding_completed ? "/" : "/onboarding");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#0d5c42_0%,#166534_40%,#14532d_70%,#052e16_100%)] p-12 lg:flex">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/5 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <ShoppingBasket className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-white">MigMart</span>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <h1 className="max-w-sm font-heading text-5xl leading-[1.1] text-white">
            Ready to earn while you shop?{" "}
            <span className="text-lime-300">Join MigMart</span> today.
          </h1>

          {/* Members row */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="member"
                  className="h-10 w-10 rounded-full border-2 border-white/40 object-cover"
                />
              ))}
            </div>
            <div className="text-sm text-white/80">
              <span className="font-semibold text-white">9.5k</span> members earning rewards
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700">
            <ShoppingBasket className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-green-900">MigMart</span>
        </div>

        <div className="w-full max-w-md">
          <h2 className="font-heading text-4xl text-gray-900">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "signin"
              ? "Welcome back! Enter your credentials to continue."
              : <>Get started with an account on <span className="font-semibold text-green-700">MigMart</span></>}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/20"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/20"
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-xs font-medium text-green-700 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/20"
                required
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Repeat your password"
                  minLength={8}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/20"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-400">At least 8 characters</p>
              </div>
            )}

            <label className="flex items-start gap-2.5 pt-1 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-green-700"
              />
              <span>
                By registering you agree to our{" "}
                <button type="button" className="font-medium text-green-700 hover:underline">
                  Terms &amp; Conditions
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-green-700 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "signup" ? "Proceed" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-green-700 hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
