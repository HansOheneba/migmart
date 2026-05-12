"use client";

import { useState } from "react";
import { Crown, EyeOff, Eye } from "lucide-react";
import type { Profile } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";

type LeaderboardProps = {
  users: Profile[];
  currentUserId: string;
};

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  const [optedOut, setOptedOut] = useState(false);

  const visibleUsers = optedOut
    ? users.filter((u) => u.user_id !== currentUserId)
    : users;

  const currentRank = users.findIndex((u) => u.user_id === currentUserId) + 1;
  const currentUser = users.find((u) => u.user_id === currentUserId);
  const nextUser = currentRank > 1 ? users[currentRank - 2] : null;
  const ptsToNext =
    nextUser && currentUser ? nextUser.points - currentUser.points : null;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">
            Live Leaderboard
          </h3>
          {!optedOut && currentRank > 0 && (
            <p className="text-xs text-(--ink-500)">
              You're #{currentRank}
              {ptsToNext !== null && ptsToNext > 0
                ? ` — ${ptsToNext} pts behind #${currentRank - 1}`
                : currentRank === 1
                  ? " — you're on top! 🏆"
                  : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOptedOut((v) => !v)}
            title={optedOut ? "Show my position" : "Hide me from leaderboard"}
            className="rounded-lg p-1 transition hover:bg-black/10"
          >
            {optedOut ? (
              <Eye className="h-4 w-4 text-(--ink-500)" />
            ) : (
              <EyeOff className="h-4 w-4 text-(--ink-500)" />
            )}
          </button>
          <Crown className="h-5 w-5 text-yellow-500" />
        </div>
      </div>

      {optedOut && (
        <p className="mb-3 rounded-xl bg-(--sand-100) px-3 py-2 text-xs text-(--ink-500)">
          You've hidden yourself from the leaderboard. Tap the eye icon to
          reappear.
        </p>
      )}

      <div className="space-y-2">
        {visibleUsers.slice(0, 8).map((user, index) => {
          const isMe = user.user_id === currentUserId;
          const medal =
            index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;
          return (
            <div
              key={user.user_id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                isMe
                  ? "bg-(--lime-300)/30 ring-1 ring-(--green-700)/30"
                  : "bg-(--sand-100)"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-(--ink-500)">
                  {medal ?? `#${index + 1}`}
                </span>
                <p className="text-sm font-semibold text-(--ink-900)">
                  {user.display_name ?? "Shopper"}
                  {isMe ? " (you)" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-(--ink-900)">
                  {user.points} pts
                </p>
                <p className="text-xs text-(--ink-500)">{user.tier}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
