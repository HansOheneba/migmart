"use client";

import { Crown } from "lucide-react";
import type { Profile } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";

type LeaderboardProps = {
  users: Profile[];
  currentUserId: string;
};

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-2xl text-(--ink-900)">Live Leaderboard</h3>
        <Crown className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="space-y-2">
        {users.slice(0, 8).map((user, index) => (
          <div
            key={user.user_id}
            className={`flex items-center justify-between rounded-xl px-3 py-2 ${
              user.user_id === currentUserId ? "bg-(--lime-300)/30" : "bg-(--sand-100)"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-sm font-bold text-(--ink-500)">#{index + 1}</span>
              <p className="text-sm font-semibold text-(--ink-900)">
                {user.display_name ?? "Shopper"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-(--ink-900)">{user.points} pts</p>
              <p className="text-xs text-(--ink-500)">{user.tier}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
