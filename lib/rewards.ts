export type RewardItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsCost: number;
  type: "discount" | "free_item" | "bonus_spin";
  value: string; // human-readable value
};

export const REWARD_CATALOG: RewardItem[] = [
  {
    id: "discount_5",
    title: "GHC 5 Off",
    description: "Get GHC 5 off your next checkout.",
    icon: "🏷️",
    pointsCost: 75,
    type: "discount",
    value: "GHC 5 discount",
  },
  {
    id: "discount_10",
    title: "GHC 10 Off",
    description: "Get GHC 10 off your next checkout.",
    icon: "💵",
    pointsCost: 150,
    type: "discount",
    value: "GHC 10 discount",
  },
  {
    id: "discount_25",
    title: "GHC 25 Off",
    description: "Get GHC 25 off your next checkout.",
    icon: "💳",
    pointsCost: 300,
    type: "discount",
    value: "GHC 25 discount",
  },
  {
    id: "free_avocado",
    title: "Free Avocados",
    description: "Claim a free pack of avocados on your next visit.",
    icon: "🥑",
    pointsCost: 120,
    type: "free_item",
    value: "1 pack of avocados",
  },
  {
    id: "free_bread",
    title: "Free Sourdough",
    description: "Claim a free sourdough loaf on your next visit.",
    icon: "🍞",
    pointsCost: 100,
    type: "free_item",
    value: "1 sourdough loaf",
  },
  {
    id: "bonus_spin",
    title: "Bonus Spin",
    description: "Get an extra spin on the wheel today.",
    icon: "🎡",
    pointsCost: 50,
    type: "bonus_spin",
    value: "1 extra spin",
  },
];
