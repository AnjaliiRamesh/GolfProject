export type UserRole = 'user' | 'admin';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due' | 'trialing';
export type PlanType = 'monthly' | 'yearly';
export type DrawType = '5_match' | '4_match' | '3_match';
export type DrawMode = 'random' | 'algorithmic';
export type DrawStatus = 'draft' | 'simulated' | 'running' | 'completed' | 'published';
export type WinnerStatus = 'pending' | 'proof_uploaded' | 'approved' | 'rejected' | 'paid';
export type PaymentStatus = 'succeeded' | 'failed' | 'refunded';
export type AlgoStrategy = 'most_frequent' | 'least_frequent';
export type DonationType = 'subscription' | 'independent';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_type: PlanType;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  category: string | null;
  logo_url: string | null;
  banner_url: string | null;
  website_url: string | null;
  featured: boolean;
  active: boolean;
  total_raised: number;
  created_at: string;
  updated_at: string;
}

export interface UserCharity {
  id: string;
  user_id: string;
  charity_id: string;
  contribution_percentage: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  charity?: Charity;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  played_date: string;
  created_at: string;
  updated_at: string;
}

export interface Draw {
  id: string;
  draw_date: string;
  month: number;
  year: number;
  draw_mode: DrawMode;
  algo_strategy: AlgoStrategy | null;
  status: DrawStatus;
  winning_numbers: number[];
  total_prize_pool: number;
  jackpot_rollover: number;
  five_match_pool: number;
  four_match_pool: number;
  three_match_pool: number;
  total_entries: number;
  is_simulation: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  scores: number[];
  matched_count: number;
  is_winner: boolean;
  created_at: string;
}

export interface Winner {
  id: string;
  draw_id: string;
  draw_entry_id: string;
  user_id: string;
  draw_type: DrawType;
  prize_amount: number;
  status: WinnerStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  draw?: Draw;
  proofs?: WinnerProof[];
}

export interface WinnerProof {
  id: string;
  winner_id: string;
  user_id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  notes: string | null;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  charity_id: string;
  amount: number;
  source: DonationType;
  stripe_payment_id: string | null;
  month: number | null;
  year: number | null;
  created_at: string;
  charity?: Charity;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// Composite types for dashboard
export interface DashboardOverview {
  subscription: Subscription | null;
  recentScores: Score[];
  nextDraw: Draw | null;
  totalWinnings: number;
  selectedCharity: UserCharity | null;
  unreadNotifications: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalDonated: number;
  totalPrizesPaid: number;
  drawParticipationRate: number;
  conversionRate: number;
  revenueHistory: { month: string; revenue: number }[];
  subscriptionGrowth: { month: string; count: number }[];
  donationsByCharity: { charity: string; amount: number }[];
}
