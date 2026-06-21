'use server';

import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import {
  sendDrawResultsEmail,
  sendWinnerNotificationEmail,
  sendBulkDrawResultsEmails,
} from '@/lib/email/service';

export async function processDrawResults(drawId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    // Get draw details
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (drawError) throw drawError;

    // Get all draw entries
    const { data: entries, error: entriesError } = await supabase
      .from('draw_entries')
      .select(`
        *,
        profiles(email, full_name)
      `)
      .eq('draw_id', drawId);

    if (entriesError) throw entriesError;

    // Prepare emails
    const emailsToSend = (entries || []).map((entry: any) => {
      const userMatches = calculateMatches(entry.scores, draw.winning_numbers);
      const hasPrize = userMatches >= 3; // 3, 4, or 5 match wins

      return {
        email: entry.profiles?.email,
        fullName: entry.profiles?.full_name || 'User',
        drawDate: draw.draw_date,
        winningNumbers: draw.winning_numbers,
        userMatches,
        hasPrize,
        prizeAmount: hasPrize ? calculatePrize(userMatches, draw) : undefined,
      };
    });

    // Send emails in bulk
    await sendBulkDrawResultsEmails(emailsToSend);

    revalidatePath('/admin/draws');

    return { message: 'Draw results processed and emails sent' };
  } catch (error: any) {
    return { error: error.message || 'Failed to process draw results' };
  }
}

export async function notifyWinners(drawId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    // Get all winners for this draw
    const { data: winners, error: winnersError } = await supabase
      .from('winners')
      .select(`
        *,
        profiles(email, full_name),
        draws(draw_date)
      `)
      .eq('draw_id', drawId);

    if (winnersError) throw winnersError;

    // Send notification emails
    const results = await Promise.allSettled(
      (winners || []).map((winner: any) =>
        sendWinnerNotificationEmail(
          winner.profiles?.email,
          winner.profiles?.full_name || 'User',
          winner.draw_type,
          winner.prize_amount,
          winner.draws?.draw_date
        )
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    revalidatePath('/admin/winners');

    return {
      message: `Winner notifications sent. Successful: ${successful}, Failed: ${failed}`,
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to notify winners' };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateMatches(userScores: number[], winningNumbers: number[]): number {
  if (!userScores || !winningNumbers) return 0;
  return userScores.filter((score) => winningNumbers.includes(score)).length;
}

function calculatePrize(matchCount: number, draw: any): number {
  // Prize distribution based on match count
  if (matchCount === 5) {
    return (draw.five_match_pool || 0) / (draw.total_entries || 1);
  } else if (matchCount === 4) {
    return (draw.four_match_pool || 0) / (draw.total_entries || 1);
  } else if (matchCount === 3) {
    return (draw.three_match_pool || 0) / (draw.total_entries || 1);
  }
  return 0;
}

export async function getDrawEntry(drawId: string, userId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('draw_entries')
      .select('*')
      .eq('draw_id', drawId)
      .eq('user_id', userId)
      .single();

    if (error) return { error: 'Draw entry not found' };
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUserDrawHistory(userId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('draw_entries')
      .select(`
        *,
        draws(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}
