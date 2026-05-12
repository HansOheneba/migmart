"use client";

import { Trophy, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

type LoyaltyPanelProps = {
  points: number;
  tier: string;
  onRedeem: () => void;
  redeemDisabled: boolean;
};

export function LoyaltyPanel({ points, tier, onRedeem, redeemDisabled }: LoyaltyPanelProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Loyalty Vault</h3>
          <p className="text-sm text-(--ink-600)">Redeem 150 points for a checkout discount.</p>
        </div>
        <Trophy className="h-5 w-5 text-(--green-700)" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-(--sand-100) p-3">
          <p className="text-xs text-(--ink-500)">Current Points</p>
          <p className="text-2xl font-bold text-(--ink-900)">{points}</p>
        </div>
        <div className="rounded-xl bg-(--sand-100) p-3">
          <p className="text-xs text-(--ink-500)">Current Tier</p>
          <p className="text-2xl font-bold text-(--ink-900)">{tier}</p>
        </div>
      </div>

      <button
        onClick={onRedeem}
        disabled={redeemDisabled}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-(--ink-900) px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Zap className="mr-2 h-4 w-4" />
        Redeem 150 Points
      </button>
    </Card>
  );
}
