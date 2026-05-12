// Referral system — fully localStorage-backed for the presentation demo

const REFERRALS_KEY = (userId: string) => `migmart_referrals_${userId}`;
const REFERRED_BY_KEY = "migmart_referred_by";

export type ReferralEntry = {
  code: string;
  usedBy: string; // display name
  usedAt: string;
  rewardGranted: boolean;
};

/** Deterministically generate a code from the user's display name + id */
export function generateReferralCode(userId: string, displayName: string): string {
  const base = (displayName ?? "user").toUpperCase().replace(/\s+/g, "").slice(0, 4);
  const suffix = userId.slice(-4).toUpperCase();
  return `${base}${suffix}`;
}

export function loadReferrals(userId: string): ReferralEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REFERRALS_KEY(userId));
    return raw ? (JSON.parse(raw) as ReferralEntry[]) : [];
  } catch {
    return [];
  }
}

function saveReferrals(userId: string, data: ReferralEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFERRALS_KEY(userId), JSON.stringify(data));
}

/**
 * Simulate a friend using the referral code.
 * Returns true if accepted, false if already used or invalid.
 */
export function applyReferral(
  referrerId: string,
  friendName: string,
): { ok: boolean; message: string } {
  const existing = loadReferrals(referrerId);
  if (existing.some((r) => r.usedBy.toLowerCase() === friendName.toLowerCase())) {
    return { ok: false, message: "This friend has already used your code." };
  }
  const entry: ReferralEntry = {
    code: generateReferralCode(referrerId, friendName),
    usedBy: friendName,
    usedAt: new Date().toISOString(),
    rewardGranted: true,
  };
  saveReferrals(referrerId, [...existing, entry]);
  return { ok: true, message: `${friendName} joined with your referral. +120 pts awarded!` };
}
