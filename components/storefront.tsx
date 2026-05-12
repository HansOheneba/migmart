"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { CartDrawer } from "@/components/cart-drawer";
import { SpinWheel } from "@/components/spin-wheel";
import { LoyaltyPanel } from "@/components/loyalty-panel";
import { Leaderboard } from "@/components/leaderboard";
import { AchievementsPanel } from "@/components/achievements-panel";
import { ChallengesPanel } from "@/components/challenges-panel";
import { ReferralPanel } from "@/components/referral-panel";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import { todayDateString } from "@/lib/utils";
import { incrementChallenges } from "@/lib/challenges";
import type { RewardItem } from "@/lib/rewards";

type StorefrontProps = {
  profile: Profile;
  leaderboard: Profile[];
  achievementLabels: string[];
};

function tierFromPoints(points: number) {
  if (points >= 3000) return "VIP";
  if (points >= 1600) return "Gold";
  if (points >= 700) return "Silver";
  return "Bronze";
}

type Tab = "shop" | "challenges" | "rewards" | "referral";

export function Storefront({ profile, leaderboard, achievementLabels }: StorefrontProps) {
  const supabase = createSupabaseBrowserClient();
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartSubtotal = useCartStore((state) => state.subtotal);

  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const [points, setPoints] = useState(profile.points);
  const [tier, setTier] = useState(profile.tier || "Bronze");
  const [spinsAvailable, setSpinsAvailable] = useState(profile.spins_available ?? 1);
  const [lastSpinDate, setLastSpinDate] = useState(profile.last_spin_date);
  const [latestSpinPoints, setLatestSpinPoints] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<string[]>(achievementLabels);
  /** Bump to force ChallengesPanel to re-read localStorage */
  const [challengeVersion, setChallengeVersion] = useState(0);

  const canSpin = spinsAvailable > 0;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const term = search.trim().toLowerCase();
      const searchMatch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const flashDeal = useMemo(
    () => products.find((item) => (item.discountPercent ?? 0) >= 12) ?? products[0],
    [],
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const trackEvent = async (eventType: string, payload: Record<string, unknown>) => {
    await supabase.from("user_events").insert({
      user_id: profile.user_id,
      event_type: eventType,
      payload,
    });
  };

  const unlockAchievement = async (key: string, label: string) => {
    await supabase.rpc("unlock_achievement", { p_key: key, p_user_id: profile.user_id });
    setAchievements((prev) => (prev.includes(label) ? prev : [...prev, label]));
  };

  const awardPoints = async (amount: number, reason: string, meta?: Record<string, unknown>) => {
    const newPoints = points + amount;
    const nextTier = tierFromPoints(newPoints);

    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints, tier: nextTier })
      .eq("user_id", profile.user_id);

    if (error) { toast.error(error.message); return false; }

    await supabase.from("point_ledger").insert({
      user_id: profile.user_id,
      points_change: amount,
      reason,
      metadata: meta ?? {},
    });

    setPoints(newPoints);
    setTier(nextTier);

    // Tier badges
    if (nextTier === "Silver" && !achievements.includes("silver member"))
      await unlockAchievement("silver_member", "silver member");
    if (nextTier === "Gold" && !achievements.includes("gold member"))
      await unlockAchievement("gold_member", "gold member");
    if (nextTier === "VIP" && !achievements.includes("vip member"))
      await unlockAchievement("vip_member", "vip member");

    return true;
  };


  // ─── Spin ─────────────────────────────────────────────────────────────────

  const handleSpin = async (reward: number) => {
    if (!canSpin) { toast.error("Spin unavailable right now."); return; }

    const { error } = await supabase
      .from("profiles")
      .update({
        points: points + reward,
        tier: tierFromPoints(points + reward),
        spins_available: Math.max(0, spinsAvailable - 1),
        last_spin_date: todayDateString(),
      })
      .eq("user_id", profile.user_id);

    if (error) { toast.error(error.message); return; }

    await supabase.from("spin_events").insert({
      user_id: profile.user_id,
      reward_points: reward,
      reward_type: "points",
      metadata: { source: "daily_spin" },
    });
    await supabase.from("point_ledger").insert({
      user_id: profile.user_id,
      points_change: reward,
      reason: "spin_reward",
      metadata: { reward_type: "daily_spin" },
    });
    await trackEvent("spin_completed", { reward_points: reward });

    const newPoints = points + reward;
    const nextTier = tierFromPoints(newPoints);
    setPoints(newPoints);
    setTier(nextTier);
    setSpinsAvailable((v) => Math.max(0, v - 1));
    setLastSpinDate(todayDateString());
    setLatestSpinPoints(reward);
    toast.success(`You won ${reward} points!`);

    // Badge checks
    if (!achievements.includes("first spin")) await unlockAchievement("first_spin", "first spin");
    if (reward >= 120 && !achievements.includes("big spin")) await unlockAchievement("big_spin", "big spin");
    if (nextTier === "Silver" && !achievements.includes("silver member")) await unlockAchievement("silver_member", "silver member");
    if (nextTier === "Gold" && !achievements.includes("gold member")) await unlockAchievement("gold_member", "gold member");
    if (nextTier === "VIP" && !achievements.includes("vip member")) await unlockAchievement("vip_member", "vip member");

    // Challenge progress
    const done = incrementChallenges(profile.user_id, "spin", 1);
    if (done.length) {
      setChallengeVersion((v) => v + 1);
      const { CHALLENGES } = await import("@/lib/challenges");
      for (const id of done) {
        const ch = CHALLENGES.find((c) => c.id === id);
        if (ch) {
          toast.success(`Challenge complete: ${ch.title}! +${ch.pointsReward} pts`);
          await awardPoints(ch.pointsReward, "challenge_reward", { challenge_id: id });
        }
      }
    }
  };

  // ─── Redeem from catalog ──────────────────────────────────────────────────

  const handleRedeem = async (reward: RewardItem) => {
    if (points < reward.pointsCost) {
      toast.error(`You need ${reward.pointsCost} points for this reward.`);
      return;
    }

    const newPoints = points - reward.pointsCost;
    const nextTier = tierFromPoints(newPoints);

    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints, tier: nextTier })
      .eq("user_id", profile.user_id);

    if (error) { toast.error(error.message); return; }

    await supabase.from("point_ledger").insert({
      user_id: profile.user_id,
      points_change: -reward.pointsCost,
      reason: "points_redemption",
      metadata: { reward_id: reward.id, value: reward.value },
    });
    await trackEvent("points_redeemed", { reward_id: reward.id, points_used: reward.pointsCost });

    setPoints(newPoints);
    setTier(nextTier);
    toast.success(`Redeemed: ${reward.title} — ${reward.value}`);

    // Bonus spin reward
    if (reward.type === "bonus_spin") {
      await supabase
        .from("profiles")
        .update({ spins_available: spinsAvailable + 1 })
        .eq("user_id", profile.user_id);
      setSpinsAvailable((v) => v + 1);
    }

    // Badge + challenge
    if (!achievements.includes("first redemption")) {
      await unlockAchievement("first_redemption", "first redemption");
    }
    const done = incrementChallenges(profile.user_id, "redeem", 1);
    if (done.length) {
      setChallengeVersion((v) => v + 1);
      const { CHALLENGES } = await import("@/lib/challenges");
      for (const id of done) {
        const ch = CHALLENGES.find((c) => c.id === id);
        if (ch) {
          toast.success(`Challenge complete: ${ch.title}! +${ch.pointsReward} pts`);
          await awardPoints(ch.pointsReward, "challenge_reward", { challenge_id: id });
        }
      }
    }
  };

  // ─── Checkout ─────────────────────────────────────────────────────────────

  const handleCheckout = async () => {
    const total = cartSubtotal();
    // Award 1 point per GHC 1 spent (simulate GHC with USD subtotal)
    const earned = Math.floor(total);
    clearCart();

    await trackEvent("checkout_completed", { timestamp: new Date().toISOString(), subtotal: total });

    if (earned > 0) {
      const ok = await awardPoints(earned, "purchase_reward", { subtotal: total });
      if (ok) toast.success(`Checkout complete! +${earned} pts earned.`);
    } else {
      toast.success("Checkout complete. Thanks for shopping Migmart.");
    }

    // Badge: first purchase
    if (!achievements.includes("first purchase")) {
      await unlockAchievement("first_purchase", "first purchase");
    }
    // Badge: big spender
    if (total >= 200 && !achievements.includes("big spender")) {
      await unlockAchievement("big_spender", "big spender");
    }

    // Challenges
    const spendDone = incrementChallenges(profile.user_id, "spend", total);
    const checkoutDone = incrementChallenges(profile.user_id, "checkout", 1);
    const allDone = [...spendDone, ...checkoutDone];

    if (allDone.length) {
      setChallengeVersion((v) => v + 1);
      const { CHALLENGES } = await import("@/lib/challenges");
      for (const id of allDone) {
        const ch = CHALLENGES.find((c) => c.id === id);
        if (ch) {
          toast.success(`Challenge complete: ${ch.title}! +${ch.pointsReward} pts`);
          await awardPoints(ch.pointsReward, "challenge_reward", { challenge_id: id });
        }
      }
    }

    // Badge: regular shopper (check localStorage checkout count)
    const checkoutKey = `migmart_checkouts_${profile.user_id}`;
    const prevCount = parseInt(localStorage.getItem(checkoutKey) ?? "0", 10);
    const newCount = prevCount + 1;
    localStorage.setItem(checkoutKey, String(newCount));
    if (newCount >= 3 && !achievements.includes("regular shopper")) {
      await unlockAchievement("regular_shopper", "regular shopper");
    }
  };

  // ─── Referral success ─────────────────────────────────────────────────────

  const handleReferralSuccess = async () => {
    await awardPoints(120, "referral_reward", {});
    if (!achievements.includes("referral master")) {
      await unlockAchievement("referral_master", "referral master");
    }
    const done = incrementChallenges(profile.user_id, "referral", 1);
    if (done.length) {
      setChallengeVersion((v) => v + 1);
      const { CHALLENGES } = await import("@/lib/challenges");
      for (const id of done) {
        const ch = CHALLENGES.find((c) => c.id === id);
        if (ch) {
          await awardPoints(ch.pointsReward, "challenge_reward", { challenge_id: id });
        }
      }
    }

    // Challenge master badge
    const { loadProgress, CHALLENGES } = await import("@/lib/challenges");
    const prog = loadProgress(profile.user_id);
    const completedCount = CHALLENGES.filter((c) => prog[c.id]?.completed).length;
    if (completedCount >= 3 && !achievements.includes("challenge master")) {
      await unlockAchievement("challenge_master", "challenge master");
    }
  };

  // ─── Tabs ─────────────────────────────────────────────────────────────────

  const TABS: { id: Tab; label: string }[] = [
    { id: "shop", label: "Shop" },
    { id: "challenges", label: "Challenges" },
    { id: "rewards", label: "Rewards" },
    { id: "referral", label: "Referral" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_2%_5%,rgba(208,233,146,0.45),transparent_25%),radial-gradient(circle_at_98%_8%,rgba(13,93,66,0.25),transparent_30%),var(--sand-200)]">
      <Navbar
        displayName={profile.display_name ?? "Shopper"}
        isAdmin={Boolean(profile.is_admin)}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Flash Deal Banner */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#f4efdf_0%,#efe5ce_55%,#d8eb9a_100%)] p-6 shadow-xl"
        >
          <p className="mb-2 inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-(--green-900)">
            Flash Deal
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="max-w-2xl font-heading text-4xl leading-tight text-(--ink-900) md:text-5xl">
                Grab up to {flashDeal.discountPercent ?? 10}% off on fresh essentials this week.
              </h1>
              <p className="mt-2 text-sm text-(--ink-600)">
                Highlighted item: {flashDeal.name}. Reward points stack with active discounts.
              </p>
            </div>
            <Button onClick={() => setActiveTab("shop")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop Deal
            </Button>
          </div>
        </motion.section>

        {/* Tab navigation */}
        <div className="mb-5 flex gap-1 rounded-2xl bg-white/70 p-1.5 ring-1 ring-black/10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-(--green-700) text-white shadow-sm"
                  : "text-(--ink-600) hover:bg-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Shop Tab ── */}
        {activeTab === "shop" && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-white/80 p-3 ring-1 ring-black/10 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--ink-400)" />
                  <input
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 text-sm outline-none ring-(--green-700) focus:ring-2"
                    placeholder="Search products or categories"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        activeCategory === cat
                          ? "bg-(--green-700) text-white"
                          : "bg-(--sand-100) text-(--ink-700)"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(item) => {
                      addItem(item);
                      toast.success(`${item.name} added to cart`);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SpinWheel
                pointsAward={latestSpinPoints}
                canSpin={canSpin}
                spinsAvailable={spinsAvailable}
                onSpin={(reward) => void handleSpin(reward)}
              />
              <Leaderboard users={leaderboard} currentUserId={profile.user_id} />
            </div>
          </section>
        )}

        {/* ── Challenges Tab ── */}
        {activeTab === "challenges" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <ChallengesPanel
              userId={profile.user_id}
              progressVersion={challengeVersion}
            />
            <AchievementsPanel achievements={achievements} />
          </div>
        )}

        {/* ── Rewards Tab ── */}
        {activeTab === "rewards" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <LoyaltyPanel
              points={points}
              tier={tier}
              onRedeem={(reward) => void handleRedeem(reward)}
            />
            <SpinWheel
              pointsAward={latestSpinPoints}
              canSpin={canSpin}
              spinsAvailable={spinsAvailable}
              onSpin={(reward) => void handleSpin(reward)}
            />
          </div>
        )}

        {/* ── Referral Tab ── */}
        {activeTab === "referral" && (
          <div className="mx-auto max-w-lg">
            <ReferralPanel
              userId={profile.user_id}
              displayName={profile.display_name ?? "Shopper"}
              onReferralSuccess={() => void handleReferralSuccess()}
            />
          </div>
        )}
      </main>

      <CartDrawer onCheckout={() => void handleCheckout()} />
    </div>
  );
}
