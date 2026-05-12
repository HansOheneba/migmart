"use client";

import { useEffect, useState } from "react";
import { Users, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  generateReferralCode,
  loadReferrals,
  applyReferral,
  type ReferralEntry,
} from "@/lib/referrals";

type ReferralPanelProps = {
  userId: string;
  displayName: string;
  onReferralSuccess: () => void;
};

export function ReferralPanel({ userId, displayName, onReferralSuccess }: ReferralPanelProps) {
  const code = generateReferralCode(userId, displayName);
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [friendName, setFriendName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setReferrals(loadReferrals(userId));
  }, [userId]);

  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    const name = friendName.trim();
    if (!name) {
      toast.error("Enter a friend's name to simulate the referral.");
      return;
    }
    const result = applyReferral(userId, name);
    if (result.ok) {
      setReferrals(loadReferrals(userId));
      setFriendName("");
      toast.success(result.message);
      onReferralSuccess();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Refer a Friend</h3>
          <p className="text-sm text-(--ink-600)">
            Both you and your friend get +120 pts when they join.
          </p>
        </div>
        <Users className="h-5 w-5 text-(--green-700)" />
      </div>

      {/* Referral code display */}
      <div className="flex items-center gap-2 rounded-xl bg-(--sand-100) px-4 py-3">
        <p className="flex-1 font-mono text-lg font-bold tracking-widest text-(--ink-900)">
          {code}
        </p>
        <button
          onClick={handleCopy}
          className="rounded-lg p-1.5 transition hover:bg-black/10"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-(--green-700)" />
          ) : (
            <Copy className="h-4 w-4 text-(--ink-500)" />
          )}
        </button>
      </div>

      {/* Simulate referral */}
      <div className="mt-3 flex gap-2">
        <Input
          placeholder="Friend's name (demo)"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSimulate(); }}
        />
        <Button onClick={handleSimulate} className="shrink-0">
          Invite
        </Button>
      </div>
      <p className="mt-1 text-xs text-(--ink-400)">
        Type a name and press Invite to simulate a referral for the demo.
      </p>

      {/* Referral history */}
      {referrals.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--ink-400)">
            {referrals.length} Friend{referrals.length !== 1 ? "s" : ""} Referred
          </p>
          {referrals.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-(--lime-300)/20 px-3 py-2">
              <p className="text-sm font-semibold text-(--green-900)">{r.usedBy}</p>
              <p className="text-xs text-(--ink-400)">
                {new Date(r.usedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
