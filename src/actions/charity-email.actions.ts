'use server';

import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';
import { sendCharityUpdateEmail, sendBulkCharityUpdates } from '@/lib/email/service';

export async function sendCharityUpdateEmails(charityId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    // Get charity details
    const { data: charity, error: charityError } = await supabase
      .from('charities')
      .select('*')
      .eq('id', charityId)
      .single();

    if (charityError) throw charityError;

    // Get all users who selected this charity
    const { data: userCharities, error: ucError } = await supabase
      .from('user_charities')
      .select(`
        user_id,
        profiles(email, full_name)
      `)
      .eq('charity_id', charityId)
      .eq('active', true);

    if (ucError) throw ucError;

    // Send bulk emails
    const updates = (userCharities || []).map((uc: any) => ({
      email: uc.profiles?.email,
      fullName: uc.profiles?.full_name || 'User',
      charityName: charity.name,
      amountRaised: charity.total_raised,
    }));

    const result = await sendBulkCharityUpdates(updates);

    return {
      message: `Charity update emails sent. Successful: ${result.successful}, Failed: ${result.failed}`,
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to send charity update emails' };
  }
}

export async function sendCharityUpdateToUser(
  userEmail: string,
  fullName: string,
  charityName: string,
  amountRaised: number
): Promise<ApiResponse> {
  try {
    const result = await sendCharityUpdateEmail(userEmail, fullName, charityName, amountRaised);

    if (!result.success) {
      return { error: result.error?.message || 'Failed to send email' };
    }

    return { message: 'Charity update email sent successfully' };
  } catch (error: any) {
    return { error: error.message };
  }
}
