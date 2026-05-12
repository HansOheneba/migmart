import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, preferred_categories, onboarding_completed")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-(--sand-200) px-4 py-4">
      <OnboardingForm
        userId={user.id}
        initialName={profile?.display_name ?? ""}
        initialPreferredCategories={profile?.preferred_categories ?? []}
      />
    </main>
  );
}
