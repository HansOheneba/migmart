"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile, UserEvent } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";

type AdminDashboardProps = {
  initialProfiles: Profile[];
  initialEvents: UserEvent[];
};

export function AdminDashboard({
  initialProfiles,
  initialEvents,
}: AdminDashboardProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const profilesChannel = supabase
      .channel("admin-profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        async () => {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .order("points", { ascending: false })
            .limit(50);
          setProfiles((data as Profile[] | null) ?? []);
        },
      )
      .subscribe();

    const eventsChannel = supabase
      .channel("admin-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_events" },
        async () => {
          const { data } = await supabase
            .from("user_events")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);
          setEvents((data as UserEvent[] | null) ?? []);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, []);

  const vipCount = profiles.filter((item) => item.tier === "VIP").length;
  const onboardedCount = profiles.filter(
    (item) => item.onboarding_completed,
  ).length;
  const totalPoints = profiles.reduce(
    (sum, item) => sum + (item.points ?? 0),
    0,
  );

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      <h1 className="font-heading text-5xl text-(--ink-900)">Admin Insights</h1>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-(--ink-500)">Total Customers</p>
          <p className="mt-1 text-3xl font-bold text-(--ink-900)">
            {profiles.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-(--ink-500)">Onboarded Users</p>
          <p className="mt-1 text-3xl font-bold text-(--ink-900)">
            {onboardedCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-(--ink-500)">VIP Members</p>
          <p className="mt-1 text-3xl font-bold text-(--ink-900)">{vipCount}</p>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-black/10 px-4 py-3">
            <h2 className="font-heading text-2xl text-(--ink-900)">
              Leaderboard
            </h2>
            <p className="text-xs text-(--ink-500)">
              Total points across customers: {totalPoints}
            </p>
          </div>
          <div className="max-h-115 overflow-auto p-3">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-(--ink-500)">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Tier</th>
                  <th className="pb-2">Points</th>
                  <th className="pb-2">Spins</th>
                  <th className="pb-2">Onboarding</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.user_id} className="border-t border-black/5">
                    <td className="py-2 font-semibold text-(--ink-900)">
                      {profile.display_name ?? "Shopper"}
                    </td>
                    <td className="py-2">{profile.tier}</td>
                    <td className="py-2">{profile.points}</td>
                    <td className="py-2">{profile.spins_available}</td>
                    <td className="py-2">
                      {profile.onboarding_completed ? "Done" : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-black/10 px-4 py-3">
            <h2 className="font-heading text-2xl text-(--ink-900)">
              Recent Activity
            </h2>
            <p className="text-xs text-(--ink-500)">
              Live stream from user events
            </p>
          </div>
          <div className="max-h-115 space-y-2 overflow-auto p-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl bg-(--sand-100) p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-(--ink-900)">
                    {event.event_type}
                  </p>
                  <p className="text-xs text-(--ink-500)">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="mt-1 text-xs text-(--ink-500)">
                  User: {event.user_id}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
