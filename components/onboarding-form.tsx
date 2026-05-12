"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categories } from "@/lib/products";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type OnboardingFormProps = {
  userId: string;
  initialName: string;
  initialPreferredCategories: string[];
};

export function OnboardingForm({
  userId,
  initialName,
  initialPreferredCategories,
}: OnboardingFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialPreferredCategories);
  const [saving, setSaving] = useState(false);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        preferred_categories: selectedCategories,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await supabase.from("user_events").insert({
      user_id: userId,
      event_type: "onboarding_completed",
      payload: { preferred_categories: selectedCategories.length },
    });

    toast.success("Onboarding complete.");
    router.replace("/");
    setSaving(false);
  };

  return (
    <Card className="mx-auto mt-10 w-full max-w-2xl p-6 sm:p-8">
      <h1 className="font-heading text-4xl text-(--ink-900)">Welcome to Migmart</h1>
      <p className="mt-2 text-sm text-(--ink-600)">
        Set your shopper profile so we can personalize your deals.
      </p>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-(--ink-700)">Display name</label>
          <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-(--ink-700)">Favorite categories</p>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((item) => item !== "All")
              .map((category) => {
                const active = selectedCategories.includes(category);
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      active
                        ? "bg-(--green-700) text-white"
                        : "bg-(--sand-100) text-(--ink-700)"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
          </div>
        </div>

        <Button className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Finish onboarding"}
        </Button>
      </form>
    </Card>
  );
}
