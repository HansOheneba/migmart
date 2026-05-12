import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle();

    redirect(profile?.onboarding_completed ? "/" : "/onboarding");
  }

  return (
    <div className="min-h-screen bg-(--color-camel-100)">
      <AuthForm />
    </div>
  );
}
