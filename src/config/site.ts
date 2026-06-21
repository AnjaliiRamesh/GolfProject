export const siteConfig = {
  name: 'GreenSwing',
  description: 'Track your golf performance, win monthly prizes, and support charities that matter.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  creator: 'GreenSwing',
  keywords: [
    'golf',
    'performance tracking',
    'charity',
    'prize draw',
    'stableford',
    'community',
    'subscription',
  ],
  links: {
    twitter: '#',
    github: '#',
  },
} as const;

export const subscriptionPlans = {
  monthly: {
    name: 'Monthly',
    price: 999, // in pence
    priceDisplay: '£9.99',
    interval: 'month' as const,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
    features: [
      'Track your Stableford scores',
      'Enter monthly prize draws',
      'Support your chosen charity',
      'Full performance dashboard',
      'Winner verification system',
      'Community access',
    ],
  },
  yearly: {
    name: 'Yearly',
    price: 9900, // in pence
    priceDisplay: '£99',
    interval: 'year' as const,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || '',
    badge: 'Save 17%',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early access to features',
      'Exclusive member events',
      'Annual impact report',
    ],
  },
} as const;

export const charityContributionOptions = [10, 15, 20, 25, 30] as const;

export const drawConfig = {
  jackpotCap: 5000000, // £50,000 in pence
  distribution: {
    fiveMatch: 0.40,
    fourMatch: 0.35,
    threeMatch: 0.25,
  },
  scoreRange: { min: 1, max: 45 },
  maxScores: 5,
  drawNumbers: 5,
} as const;
