export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  points: number;
  tier: string;
  spins_available: number;
  last_spin_date: string | null;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  preferred_categories: string[] | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type UserEvent = {
  id: string;
  user_id: string;
  event_type: string;
  payload: Json | null;
  created_at: string;
};

export type SpinEvent = {
  id: string;
  user_id: string;
  reward_points: number;
  reward_type: string;
  metadata: Json | null;
  created_at: string;
};

export type AchievementRow = {
  id: string;
  key: string;
  title: string;
  description: string;
  points_reward: number;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  metadata: Json | null;
};
