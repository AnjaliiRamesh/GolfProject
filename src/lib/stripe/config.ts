export const STRIPE_CONFIG = {
  monthly: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
    amount: 999, // £9.99 in pence
    interval: 'month' as const,
  },
  yearly: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!,
    amount: 9900, // £99 in pence
    interval: 'year' as const,
  },
} as const;

export const STRIPE_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
] as const;
