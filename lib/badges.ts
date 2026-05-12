export type BadgeDef = {
  key: string;
  title: string;
  icon: string;
  description: string;
  requirement: string;
};

export const ALL_BADGES: BadgeDef[] = [
  {
    key: "first spin",
    title: "First Spin",
    icon: "🎡",
    description: "Spun the wheel for the first time.",
    requirement: "Spin the wheel once.",
  },
  {
    key: "big spin",
    title: "Big Win",
    icon: "💥",
    description: "Won 120+ points in a single spin.",
    requirement: "Win 120 or more points in one spin.",
  },
  {
    key: "first redemption",
    title: "Reward Hunter",
    icon: "🎁",
    description: "Redeemed points for the first time.",
    requirement: "Redeem any reward from the catalog.",
  },
  {
    key: "first purchase",
    title: "First Purchase",
    icon: "🛒",
    description: "Completed your first checkout.",
    requirement: "Complete your first order.",
  },
  {
    key: "big spender",
    title: "Big Spender",
    icon: "💰",
    description: "Spent GHC 200+ in a single order.",
    requirement: "Check out with GHC 200 or more.",
  },
  {
    key: "regular shopper",
    title: "Regular Shopper",
    icon: "🏪",
    description: "Completed 3 or more checkouts.",
    requirement: "Complete 3 checkouts total.",
  },
  {
    key: "silver member",
    title: "Silver Member",
    icon: "🥈",
    description: "Reached Silver tier.",
    requirement: "Earn 700 points.",
  },
  {
    key: "gold member",
    title: "Gold Member",
    icon: "🥇",
    description: "Reached Gold tier.",
    requirement: "Earn 1,600 points.",
  },
  {
    key: "vip member",
    title: "VIP Member",
    icon: "👑",
    description: "Reached VIP tier — the top of the loyalty ladder.",
    requirement: "Earn 3,000 points.",
  },
  {
    key: "referral master",
    title: "Referral Master",
    icon: "👥",
    description: "Referred 1 or more friends to MigMart.",
    requirement: "Get 1 friend to join using your referral code.",
  },
  {
    key: "challenge master",
    title: "Challenge Master",
    icon: "🏆",
    description: "Completed 3 challenges.",
    requirement: "Complete any 3 challenges.",
  },
];
