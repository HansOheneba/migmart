import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Upsert profile so onboarding works correctly
      await supabase.from("profiles").upsert(
        {
          user_id: data.user.id,
          display_name:
            (data.user.user_metadata?.display_name as string | undefined) ||
            data.user.email?.split("@")[0] ||
            "Shopper",
        },
        { onConflict: "user_id" },
      );

      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  // Something went wrong — send back to auth with an error hint
  return NextResponse.redirect(new URL("/auth?error=verification_failed", url.origin));
}
