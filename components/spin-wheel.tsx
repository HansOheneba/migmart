"use client";

import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SpinWheelProps = {
  pointsAward: number | null;
  canSpin: boolean;
  spinsAvailable: number;
  onSpin: () => void;
};

export function SpinWheel({
  pointsAward,
  canSpin,
  spinsAvailable,
  onSpin,
}: SpinWheelProps) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-(--lime-300)/30 blur-2xl" />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Spin To Win</h3>
          <p className="mt-1 text-sm text-(--ink-600)">
            Daily spin rewards. Limited by available spins.
          </p>
        </div>
        <Gift className="h-5 w-5 text-(--green-800)" />
      </div>

      <div className="mt-4 grid place-items-center">
        <div className="relative h-40 w-40 rounded-full border-8 border-white bg-[conic-gradient(from_180deg,var(--green-700),var(--sand-300),var(--lime-300),var(--green-900),var(--green-700))] shadow-lg">
          <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white shadow-inner" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-(--ink-600)">Spins available: {spinsAvailable}</p>
        <Button onClick={onSpin} disabled={!canSpin}>
          <Sparkles className="mr-2 h-4 w-4" />
          Spin Now
        </Button>
      </div>

      {pointsAward ? (
        <p className="mt-3 rounded-xl bg-(--lime-300)/30 px-3 py-2 text-sm font-semibold text-(--green-900)">
          You won {pointsAward} points!
        </p>
      ) : null}
    </Card>
  );
}
