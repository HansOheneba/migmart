"use client";

import { Trophy, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { REWARD_CATALOG, type RewardItem } from "@/lib/rewards";

type LoyaltyPanelProps = {
  points: number;
  tier: string;
  onRedeem: (reward: RewardItem) => void;
};

const TIER_PROGRESS: Record<string, { next: string; target: number; label: string }> = {
  Bronze: { next: "Silver", target: 700, label: "Silver" },
  Silver: { next: "Gold", target: 1600, label: "Gold" },
  Gold: { next: "VIP", target: 3000, label: "VIP" },
  VIP: { next: "VIP", target: 3000, label: "VIP" },
};

export function LoyaltyPanel({ points, tier, onRedeem }: LoyaltyPanelProps) {
  const progress = TIER_PROGRESS[tier] ?? TIER_PROGRESS["Bronze"];
  const pct = tier === "VIP" ? 100 : Math.min(100, Math.round((points / progress.target) * 100));
  const ptsToNext = Math.max(0, progress.target - points);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Loyalty Vault</h3>
          <p className="text-sm text-(--ink-600)">Redeem points for rewards below.</p>
        </div>
        <Trophy className="h-5 w-5 text-(--green-700)" />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-(--sand-100) p-3">
          <p className="text-xs text-(--ink-500)">Points</p>
          <p className="text-2xl font-bold text-(--ink-900)">{points}</p>
        </div>
        <div className="rounded-xl bg-(--sand-100) p-3">
          <p className="text-xs text-(--ink-500)">Tier</p>
          <p className="text-2xl font-bold text-(--ink-900)">{tier}</p>
        </div>
      </div>

      {/* Tier progress bar */}
      {tier !== "VIP" && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-(--ink-500)">
            <span>{tier}</span>
            <span>{ptsToNext} pts to {progress.label}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-(--green-700) transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Reward catalog */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-(--ink-400)">Reward Catalog</p>
        {REWARD_CATALOG.map((reward) => {
          const canAfford = points >= reward.pointsCost;
          return (
            <div
              key={reward.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-(--sand-100) px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{reward.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-(--ink-900)">{reward.title}</p>
                  <p className="text-xs text-(--ink-500)">{reward.description}</p>
                </div>
              </div>
              <button
                onClick={() => onRedeem(reward)}
                disabled={!canAfford}
                className="shrink-0 inline-flex items-center gap-1 rounded-full bg-(--ink-900) px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap className="h-3 w-3" />
                {reward.pointsCost} pts
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

