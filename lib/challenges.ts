// Challenge definitions and localStorage-backed progress tracking

import { todayDateString } from "@/lib/utils";

export type ChallengeKind = "spend" | "spin" | "redeem" | "checkout" | "referral";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  target: number;
  kind: ChallengeKind;
  /** ISO date — null means evergreen */
  expiresAt: string | null;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "spend_50",
    title: "First Basket",
    description: "Spend GHC 50 in a single checkout.",
    icon: "🛒",
    pointsReward: 80,
    target: 50,
    kind: "spend",
    expiresAt: null,
  },
  {
    id: "spin_3",
    title: "Spin Addict",
    description: "Spin the wheel 3 times.",
    icon: "🎡",
    pointsReward: 60,
    target: 3,
    kind: "spin",
    expiresAt: null,
  },
  {
    id: "checkout_3",
    title: "Regular Shopper",
    description: "Complete 3 checkouts.",
    icon: "🏪",
    pointsReward: 100,
    target: 3,
    kind: "checkout",
    expiresAt: null,
  },
  {
    id: "redeem_first",
    title: "Reward Hunter",
    description: "Redeem a reward from the catalog.",
    icon: "🎁",
    pointsReward: 50,
    target: 1,
    kind: "redeem",
    expiresAt: null,
  },
  {
    id: "referral_1",
    title: "Spread the Word",
    description: "Refer 1 friend using your referral code.",
    icon: "👥",
    pointsReward: 120,
    target: 1,
    kind: "referral",
    expiresAt: null,
  },
  {
    id: "spend_weekly_200",
    title: "Weekly Big Spender",
    description: "Spend GHC 200 this week.",
    icon: "💰",
    pointsReward: 200,
    target: 200,
    kind: "spend",
    expiresAt: getEndOfWeek(),
  },
  {
    id: "checkout_weekly_3",
    title: "3 Visits This Week",
    description: "Complete 3 checkouts this week.",
    icon: "📅",
    pointsReward: 150,
    target: 3,
    kind: "checkout",
    expiresAt: getEndOfWeek(),
  },
  {
    id: "spin_weekly_5",
    title: "Lucky Week",
    description: "Spin the wheel 5 times this week.",
    icon: "🍀",
    pointsReward: 90,
    target: 5,
    kind: "spin",
    expiresAt: getEndOfWeek(),
  },
];

function getEndOfWeek(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysUntilSunday);
  return endOfWeek.toISOString().slice(0, 10);
}

// ─── LocalStorage helpers ───────────────────────────────────────────────────

const KEY = (userId: string) => `migmart_challenges_${userId}`;

export type ChallengeProgress = {
  progress: number;
  completed: boolean;
  completedAt: string | null;
};

export type AllProgress = Record<string, ChallengeProgress>;

export function loadProgress(userId: string): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY(userId));
    return raw ? (JSON.parse(raw) as AllProgress) : {};
  } catch {
    return {};
  }
}

export function saveProgress(userId: string, data: AllProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(userId), JSON.stringify(data));
}

/** Increment progress for challenges of a given kind. Returns list of newly completed challenge IDs. */
export function incrementChallenges(
  userId: string,
  kind: ChallengeKind,
  amount: number,
): string[] {
  const all = loadProgress(userId);
  const justCompleted: string[] = [];

  const active = CHALLENGES.filter((c) => {
    if (c.kind !== kind) return false;
    if (c.expiresAt && c.expiresAt < todayDateString()) return false;
    return true;
  });

  for (const challenge of active) {
    const prev = all[challenge.id] ?? { progress: 0, completed: false, completedAt: null };
    if (prev.completed) continue;

    const newProgress = Math.min(prev.progress + amount, challenge.target);
    const nowComplete = newProgress >= challenge.target;

    all[challenge.id] = {
      progress: newProgress,
      completed: nowComplete,
      completedAt: nowComplete ? todayDateString() : null,
    };

    if (nowComplete) justCompleted.push(challenge.id);
  }

  saveProgress(userId, all);
  return justCompleted;
}

export function isExpired(challenge: Challenge): boolean {
  if (!challenge.expiresAt) return false;
  return challenge.expiresAt < todayDateString();
}

export function daysLeft(challenge: Challenge): number | null {
  if (!challenge.expiresAt) return null;
  const today = new Date(todayDateString());
  const end = new Date(challenge.expiresAt);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86_400_000));
}
