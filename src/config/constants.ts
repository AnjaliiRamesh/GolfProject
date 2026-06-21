export const SCORE_MIN = 1;
export const SCORE_MAX = 45;
export const MAX_SCORES = 5;
export const DRAW_NUMBERS_COUNT = 5;
export const JACKPOT_CAP_PENCE = 5000000; // £50,000

export const CONTRIBUTION_PERCENTAGES = [10, 15, 20, 25, 30] as const;

export const PRIZE_DISTRIBUTION = {
  FIVE_MATCH: 0.40,
  FOUR_MATCH: 0.35,
  THREE_MATCH: 0.25,
} as const;

export const WINNER_STATUSES = {
  PENDING: 'pending',
  PROOF_UPLOADED: 'proof_uploaded',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

export const DRAW_STATUSES = {
  DRAFT: 'draft',
  SIMULATED: 'simulated',
  RUNNING: 'running',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
