"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });

        if (error) {
          throw error;
        }

        toast.success("Account created. Complete onboarding next.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Unable to load user session.");
      }

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
    <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_1.2fr] lg:p-6">
      <div className="flex flex-col rounded-[30px] bg-(--color-camel-50) px-6 py-8 shadow-[0_18px_50px_-30px_rgba(7,3,32,0.45)] sm:px-10 lg:py-10">
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-black-900) text-(--color-camel-50)">
          <span className="text-lg font-black">M</span>
        </div>

        <h1 className="font-heading text-4xl text-(--color-black-900)">
          {mode === "signin" ? "Get Started Now" : "Create Your Account"}
        </h1>
        <p className="mt-2 text-sm text-(--color-silver-700)">
          Enter your credentials to access your account
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-(--color-silver-200) bg-white text-sm font-medium text-(--color-black-900)"
          >
            <span className="mr-2">G</span> Log in with Google
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-(--color-silver-200) bg-white text-sm font-medium text-(--color-black-900)"
          >
            <span className="mr-2">A</span> Log in with Apple
          </button>
        </div>

        <div className="my-7 flex items-center gap-4 text-xs text-(--color-silver-500)">
          <div className="h-px flex-1 bg-(--color-silver-200)" />
          or
          <div className="h-px flex-1 bg-(--color-silver-200)" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-(--color-silver-900)">Name</label>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your full name"
                className="h-12 w-full rounded-xl border border-(--color-silver-200) bg-white px-4 text-sm outline-none ring-(--color-black-300) transition focus:ring-2"
                required
              />
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-(--color-silver-900)">Email address</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="name@company.com"
              className="h-12 w-full rounded-xl border border-(--color-silver-200) bg-white px-4 text-sm outline-none ring-(--color-black-300) transition focus:ring-2"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-(--color-silver-900)">Password</label>
              <button type="button" className="text-xs font-medium text-(--color-black-500)">
                Forgot password?
              </button>
            </div>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="min 8 chars"
              minLength={6}
              className="h-12 w-full rounded-xl border border-(--color-silver-200) bg-white px-4 text-sm outline-none ring-(--color-black-300) transition focus:ring-2"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-(--color-silver-800)">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="h-4 w-4 rounded border-(--color-silver-300) accent-(--color-black-500)"
            />
            I agree to the <span className="underline">Terms</span> & <span className="underline">Privacy</span>
          </label>

          <button
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-(--color-black-500) text-sm font-semibold text-white transition hover:bg-(--color-black-600) disabled:opacity-45"
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
          </button>
        </form>

        <button
          className="mt-6 text-left text-sm text-(--color-silver-800)"
          onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
        >
          {mode === "signin" ? "Have no account? " : "Have an account? "}
          <span className="font-semibold text-(--color-black-500)">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </span>
        </button>
      </div>

      <div className="relative hidden overflow-hidden rounded-[30px] bg-(--color-black-500) p-10 text-white lg:flex lg:flex-col">
        <h2 className="max-w-md font-heading text-5xl leading-tight">
          The simplest way to manage your grocery rewards experience
        </h2>
        <p className="mt-3 text-sm text-(--color-black-50)">
          Enter your credentials to access your account
        </p>

        <div className="relative mt-8 flex-1">
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm">
            <Image
              src="https://images.unsplash.com/photo-1652262968340-b735524f9ae4?q=80&w=1360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Migmart auth showcase"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,5,46,0.05),rgba(9,5,46,0.38))]" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-(--color-black-100)">
          <span>Acme</span>
          <span>Booking.com</span>
          <span>Google</span>
          <span>Spotify</span>
          <span>Stripe</span>
        </div>
      </div>
    </section>
  );
}
