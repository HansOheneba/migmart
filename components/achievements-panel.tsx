"use client";

import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ALL_BADGES } from "@/lib/badges";

type AchievementsPanelProps = {
  achievements: string[];
};

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const unlockedSet = new Set(achievements.map((a) => a.toLowerCase()));

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Badges</h3>
          <p className="text-sm text-(--ink-600)">
            {unlockedSet.size} / {ALL_BADGES.length} unlocked
          </p>
        </div>
        <Award className="h-5 w-5 text-(--green-700)" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ALL_BADGES.map((badge) => {
          const unlocked = unlockedSet.has(badge.key.toLowerCase());
          return (
            <div
              key={badge.key}
              title={
                unlocked ? badge.description : `Locked: ${badge.requirement}`
              }
              className={`flex items-center gap-2 rounded-xl p-2 transition ${
                unlocked
                  ? "bg-(--lime-300)/25 ring-1 ring-(--green-700)/30"
                  : "bg-(--sand-100) opacity-45 grayscale"
              }`}
            >
              <span className="text-xl">{badge.icon}</span>
              <div className="min-w-0">
                <p
                  className={`truncate text-xs font-semibold ${unlocked ? "text-(--green-900)" : "text-(--ink-600)"}`}
                >
                  {badge.title}
                </p>
                <p className="truncate text-xs text-(--ink-400)">
                  {unlocked ? badge.description : badge.requirement}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
