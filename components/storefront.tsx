"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { CartDrawer } from "@/components/cart-drawer";
import { SpinWheel } from "@/components/spin-wheel";
import { LoyaltyPanel } from "@/components/loyalty-panel";
import { Leaderboard } from "@/components/leaderboard";
import { AchievementsPanel } from "@/components/achievements-panel";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import { todayDateString } from "@/lib/utils";

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

export function Storefront({ profile, leaderboard, achievementLabels }: StorefrontProps) {
  const supabase = createSupabaseBrowserClient();
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const [points, setPoints] = useState(profile.points);
  const [tier, setTier] = useState(profile.tier || "Bronze");
  const [spinsAvailable, setSpinsAvailable] = useState(profile.spins_available ?? 1);
  const [lastSpinDate, setLastSpinDate] = useState(profile.last_spin_date);
  const [latestSpinPoints, setLatestSpinPoints] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<string[]>(achievementLabels);

  const canSpin = Boolean(spinsAvailable > 0 && lastSpinDate !== todayDateString());

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

  const trackEvent = async (eventType: string, payload: Record<string, unknown>) => {
    await supabase.from("user_events").insert({
      user_id: profile.user_id,
      event_type: eventType,
      payload,
    });
  };

  const unlockAchievement = async (key: string) => {
    await supabase.rpc("unlock_achievement", { p_key: key, p_user_id: profile.user_id });
  };

  const handleSpin = async () => {
    if (!canSpin) {
      toast.error("Spin unavailable right now.");
      return;
    }

    const rewards = [25, 40, 75, 120, 160];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    const newPoints = points + reward;
    const nextTier = tierFromPoints(newPoints);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        points: newPoints,
        tier: nextTier,
        spins_available: Math.max(0, spinsAvailable - 1),
        last_spin_date: todayDateString(),
      })
      .eq("user_id", profile.user_id);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

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

    if (!achievements.includes("first spin")) {
      await unlockAchievement("first_spin");
      setAchievements((prev) => [...prev, "first spin"]);
    }

    if (reward >= 120 && !achievements.includes("big spin")) {
      await unlockAchievement("big_spin");
      setAchievements((prev) => [...prev, "big spin"]);
    }

    if (nextTier === "Silver" && !achievements.includes("silver member")) {
      await unlockAchievement("silver_member");
      setAchievements((prev) => [...prev, "silver member"]);
    }

    if (nextTier === "Gold" && !achievements.includes("gold member")) {
      await unlockAchievement("gold_member");
      setAchievements((prev) => [...prev, "gold member"]);
    }

    if (nextTier === "VIP" && !achievements.includes("vip member")) {
      await unlockAchievement("vip_member");
      setAchievements((prev) => [...prev, "vip member"]);
    }

    setPoints(newPoints);
    setTier(nextTier);
    setSpinsAvailable((value) => Math.max(0, value - 1));
    setLastSpinDate(todayDateString());
    setLatestSpinPoints(reward);
    toast.success(`You won ${reward} points!`);
  };

  const handleRedeem = async () => {
    if (points < 150) {
      toast.error("You need at least 150 points.");
      return;
    }

    const newPoints = points - 150;
    const nextTier = tierFromPoints(newPoints);

    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints, tier: nextTier })
      .eq("user_id", profile.user_id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await supabase.from("point_ledger").insert({
      user_id: profile.user_id,
      points_change: -150,
      reason: "points_redemption",
      metadata: { discount_value: 10 },
    });

    await trackEvent("points_redeemed", { points_used: 150, discount: 10 });

    if (!achievements.includes("first redemption")) {
      await unlockAchievement("first_redemption");
      setAchievements((prev) => [...prev, "first redemption"]);
    }

    setPoints(newPoints);
    setTier(nextTier);
    toast.success("Redeemed 150 points for $10 off your next checkout.");
  };

  const handleCheckout = async () => {
    clearCart();
    toast.success("Checkout complete. Thanks for shopping Migmart.");
    await trackEvent("checkout_completed", { timestamp: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_2%_5%,rgba(208,233,146,0.45),transparent_25%),radial-gradient(circle_at_98%_8%,rgba(13,93,66,0.25),transparent_30%),var(--sand-200)]">
      <Navbar
        displayName={profile.display_name ?? "Shopper"}
        isAdmin={Boolean(profile.is_admin)}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
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
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              Shop Deal
            </Button>
          </div>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-white/80 p-3 ring-1 ring-black/10 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--ink-400)" />
                <input
                  className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 text-sm outline-none ring-(--green-700) focus:ring-2"
                  placeholder="Search products or categories"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      activeCategory === category
                        ? "bg-(--green-700) text-white"
                        : "bg-(--sand-100) text-(--ink-700)"
                    }`}
                  >
                    {category}
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
              onSpin={handleSpin}
            />
            <LoyaltyPanel
              points={points}
              tier={tier}
              onRedeem={handleRedeem}
              redeemDisabled={points < 150}
            />
            <AchievementsPanel achievements={achievements} />
            <Leaderboard users={leaderboard} currentUserId={profile.user_id} />
          </div>
        </section>
      </main>

      <CartDrawer onCheckout={handleCheckout} />
    </div>
  );
}
