"use client";

import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";

type AchievementsPanelProps = {
  achievements: string[];
};

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-2xl text-(--ink-900)">Achievements</h3>
        <Award className="h-5 w-5 text-(--green-700)" />
      </div>

      {achievements.length === 0 ? (
        <p className="rounded-xl bg-(--sand-100) p-3 text-sm text-(--ink-600)">
          No achievements unlocked yet. Spin and redeem to earn badges.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {achievements.map((item) => (
            <span
              key={item}
              className="rounded-full bg-(--green-100) px-3 py-1 text-xs font-semibold text-(--green-900)"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
