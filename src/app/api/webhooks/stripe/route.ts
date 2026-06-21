import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createAdminClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          const userId = session.metadata?.user_id;
          const planType = session.metadata?.plan_type as 'monthly' | 'yearly';

          if (userId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
            
            // Upsert subscription record
            const { error } = await supabase.from('subscriptions').upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_type: planType,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            });

            if (error) throw error;
          }
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        
        const { error } = await supabase.from('subscriptions').update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }).eq('stripe_subscription_id', subscription.id);

        if (error) console.error('Failed to update subscription:', error);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        
        const { error } = await supabase.from('subscriptions').update({
          status: 'canceled',
          cancel_at_period_end: false,
        }).eq('stripe_subscription_id', subscription.id);

        if (error) console.error('Failed to delete subscription:', error);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const subscriptionId = invoice.subscription as string;
          
          // Get the user ID from our subscriptions table
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (subData) {
            await supabase.from('payments').insert({
              user_id: subData.user_id,
              subscription_id: null, // need to fetch exact internal ID if needed
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'succeeded',
            });
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const subscriptionId = invoice.subscription as string;
          
          await supabase.from('subscriptions').update({
            status: 'past_due'
          }).eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }

    return new NextResponse('Webhook handled', { status: 200 });
  } catch (error: any) {
    console.error('Unhandled webhook error:', error);
    return new NextResponse('Internal Webhook Error', { status: 500 });
  }
}
