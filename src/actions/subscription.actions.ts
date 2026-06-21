'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { STRIPE_CONFIG } from '@/lib/stripe/config';
import { ApiResponse } from '@/types';

export async function createCheckoutSession(planType: 'monthly' | 'yearly'): Promise<ApiResponse<string>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized', message: 'You must be logged in to subscribe' };
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) throw new Error('Profile not found');

    const config = STRIPE_CONFIG[planType];
    
    // Check if user already has a Stripe customer ID
    let customerId;
    const { data: subscription } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    
    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.full_name || undefined,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
    });

    return { data: session.url as string };
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return { error: error.message, message: 'Failed to create checkout session' };
  }
}

export async function createCustomerPortalSession(): Promise<ApiResponse<string>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized', message: 'Not logged in' };

    const { data: subscription } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    
    if (!subscription?.stripe_customer_id) {
      return { error: 'No subscription', message: 'You do not have an active subscription' };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    return { data: session.url };
  } catch (error: any) {
    return { error: error.message, message: 'Failed to access billing portal' };
  }
}
