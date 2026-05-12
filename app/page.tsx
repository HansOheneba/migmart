import { redirect } from "next/navigation";
import { Storefront } from "@/components/storefront";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        display_name:
          (user.user_metadata?.display_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Shopper",
      },
      { onConflict: "user_id" },
    );

    const { data: insertedProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    profile = insertedProfile;
  }

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const { data: leaderboard } = await supabase
    .from("profiles")
    .select("*")
    .order("points", { ascending: false })
    .limit(8);

  const { data: achievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, achievements(title)")
    .eq("user_id", user.id);

  const achievementRows = (achievements ?? []) as Array<{
    achievements?:
      | { title?: string | null }
      | { title?: string | null }[]
      | null;
  }>;

  const achievementLabels = achievementRows
    .flatMap((row) => {
      if (Array.isArray(row.achievements)) {
        return row.achievements
          .map((entry) => entry?.title?.toLowerCase())
          .filter((value): value is string => Boolean(value));
      }

      const single = row.achievements?.title?.toLowerCase();
      return single ? [single] : [];
    })
    .filter((value): value is string => Boolean(value));

  return (
    <Storefront
      profile={profile as Profile}
      leaderboard={(leaderboard as Profile[] | null) ?? []}
      achievementLabels={achievementLabels}
    />
  );
}
