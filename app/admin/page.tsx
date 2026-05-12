import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, UserEvent } from "@/lib/supabase/types";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: selfProfile } = await supabase
    .from("profiles")
    .select("is_admin, onboarding_completed")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!selfProfile?.onboarding_completed) {
    redirect("/onboarding");
  }

  if (!selfProfile?.is_admin) {
    redirect("/");
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("points", { ascending: false })
    .limit(50);

  const { data: events } = await supabase
    .from("user_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-(--sand-200)">
      <AdminDashboard
        initialProfiles={(profiles as Profile[] | null) ?? []}
        initialEvents={(events as UserEvent[] | null) ?? []}
      />
    </div>
  );
}
