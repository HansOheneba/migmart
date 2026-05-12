"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  CHALLENGES,
  loadProgress,
  type AllProgress,
  isExpired,
  daysLeft,
} from "@/lib/challenges";

type ChallengesPanelProps = {
  userId: string;
  progressVersion: number; // bump to force re-read from localStorage
};

export function ChallengesPanel({
  userId,
  progressVersion,
}: ChallengesPanelProps) {
  const [allProgress, setAllProgress] = useState<AllProgress>({});

  useEffect(() => {
    setAllProgress(loadProgress(userId));
  }, [userId, progressVersion]);

  const active = CHALLENGES.filter((c) => !isExpired(c));

  const completed = active.filter((c) => allProgress[c.id]?.completed);
  const inProgress = active.filter((c) => !allProgress[c.id]?.completed);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Challenges</h3>
          <p className="text-sm text-(--ink-600)">
            {completed.length}/{active.length} completed
          </p>
        </div>
        <Target className="h-5 w-5 text-(--green-700)" />
      </div>

      <div className="space-y-2">
        {inProgress.map((challenge) => {
          const prog = allProgress[challenge.id] ?? {
            progress: 0,
            completed: false,
            completedAt: null,
          };
          const pct = Math.min(
            100,
            Math.round((prog.progress / challenge.target) * 100),
          );
          const days = daysLeft(challenge);

          return (
            <div key={challenge.id} className="rounded-xl bg-(--sand-100) p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{challenge.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-(--ink-900)">
                      {challenge.title}
                    </p>
                    <p className="text-xs text-(--ink-500)">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-(--green-700)">
                    +{challenge.pointsReward} pts
                  </p>
                  {days !== null ? (
                    <p className="text-xs text-(--ink-400)">{days}d left</p>
                  ) : (
                    <p className="text-xs text-(--ink-400)">Evergreen</p>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-xs text-(--ink-500)">
                  <span>
                    {prog.progress} / {challenge.target}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-(--green-700) transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {completed.length > 0 && (
          <>
            <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-(--ink-400)">
              Completed
            </p>
            {completed.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center gap-2 rounded-xl bg-(--lime-300)/20 px-3 py-2"
              >
                <span className="text-lg">{challenge.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-(--green-900)">
                    {challenge.title}
                  </p>
                  <p className="text-xs text-(--ink-500)">
                    {challenge.description}
                  </p>
                </div>
                <span className="text-sm text-(--green-700)">
                  ✓ +{challenge.pointsReward} pts
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
}
