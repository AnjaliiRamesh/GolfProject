'use server';

import { createClient } from '@/lib/supabase/server';
import { selectCharitySchema, SelectCharityInput, donationSchema, DonationInput } from '@/validators/charity.schema';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe/client';

export async function selectUserCharity(data: SelectCharityInput): Promise<ApiResponse> {
  try {
    const validatedData = selectCharitySchema.parse(data);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // Deactivate previous active charities for user
    await supabase
      .from('user_charities')
      .update({ active: false })
      .eq('user_id', user.id);

    // Upsert the new active charity selection
    const { error } = await supabase.from('user_charities').upsert({
      user_id: user.id,
      charity_id: validatedData.charity_id,
      contribution_percentage: validatedData.contribution_percentage,
      active: true,
    }, { onConflict: 'user_id, charity_id' });

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/charities');
    
    return { message: 'Charity selection updated successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') return { error: 'Validation failed' };
    return { error: error.message || 'Failed to update charity selection' };
  }
}

export async function createDonationCheckoutSession(data: DonationInput): Promise<ApiResponse<string>> {
  try {
    const validatedData = donationSchema.parse(data);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // Get the charity name for the Stripe line item
    const { data: charity } = await supabase
      .from('charities')
      .select('name')
      .eq('id', validatedData.charity_id)
      .single();

    if (!charity) return { error: 'Charity not found' };

    // Get stripe customer id if exists
    let customerId;
    const { data: subscription } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    customerId = subscription?.stripe_customer_id || undefined;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Donation to ${charity.name}`,
              description: 'Independent donation via GreenSwing',
            },
            unit_amount: validatedData.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/charities?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/charities`,
      metadata: {
        user_id: user.id,
        charity_id: validatedData.charity_id,
        type: 'independent_donation',
      },
    });

    return { data: session.url as string };
  } catch (error: any) {
    if (error.name === 'ZodError') return { error: 'Validation failed' };
    return { error: error.message || 'Failed to create checkout session' };
  }
}
