'use server';

import { createClient } from '@/lib/supabase/server';
import { FormState } from '@/types';
import { revalidatePath } from 'next/cache';
import {
  charitySchema,
  drawSchema,
  winnerActionSchema,
  CharityInput,
  DrawInput,
  WinnerActionInput,
} from '@/validators/admin.schema';

// ============================================
// ANALYTICS & STATS
// ============================================

export async function getAnalytics(): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const supabase = await createClient();
    
    const [users, totalRevenue, activeDraws, totalWinnings, charities] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('payments').select('amount').eq('status', 'succeeded'),
      supabase.from('draws').select('id', { count: 'exact' }).eq('status', 'running'),
      supabase.from('winners').select('prize_amount'),
      supabase.from('charities').select('id', { count: 'exact' }),
    ]);

    const totalRev = (totalRevenue.data || []).reduce((sum, p) => sum + p.amount, 0);
    const totalWin = (totalWinnings.data || []).reduce((sum, w) => sum + w.prize_amount, 0);

    return {
      success: true,
      data: {
        totalUsers: users.count || 0,
        totalRevenue: totalRev,
        activeDraws: activeDraws.count || 0,
        totalWinnings: totalWin,
        totalCharities: charities.count || 0,
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function getAllUsers(limit = 50, offset = 0): Promise<{
  success: boolean;
  data?: any[];
  total?: number;
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, count } = await supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        full_name,
        avatar_url,
        role,
        created_at,
        subscriptions(status),
        scores(id)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return {
      success: true,
      data: data || [],
      total: count || 0,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getUserDetails(userId: string): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at,
        subscriptions(
          id,
          stripe_subscription_id,
          plan_type,
          status,
          current_period_start,
          current_period_end
        ),
        scores(id, score, played_date),
        user_charities(
          id,
          contribution_percentage,
          charities(id, name)
        ),
        payments(id, amount, status, created_at)
      `
      )
      .eq('id', userId)
      .single();

    if (error) return { success: false, message: error.message };
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================
// CHARITY MANAGEMENT
// ============================================

export async function getAllCharities(): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { success: false, message: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createCharity(input: CharityInput): Promise<FormState> {
  try {
    const validatedData = charitySchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase.from('charities').insert([validatedData]);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/charities');
    return { success: true, message: 'Charity created successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message };
  }
}

export async function updateCharity(id: string, input: CharityInput): Promise<FormState> {
  try {
    const validatedData = charitySchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase.from('charities').update(validatedData).eq('id', id);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/charities');
    return { success: true, message: 'Charity updated successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message };
  }
}

export async function deleteCharity(id: string): Promise<FormState> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('charities').delete().eq('id', id);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/charities');
    return { success: true, message: 'Charity deleted successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================
// DRAW MANAGEMENT
// ============================================

export async function getAllDraws(): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .order('draw_date', { ascending: false });

    if (error) return { success: false, message: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createDraw(input: DrawInput): Promise<FormState> {
  try {
    const validatedData = drawSchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase.from('draws').insert([validatedData]);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/draws');
    return { success: true, message: 'Draw created successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message };
  }
}

export async function simulateDraw(drawId: string): Promise<FormState> {
  try {
    const supabase = await createClient();

    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (drawError) return { success: false, message: drawError.message };

    // Generate random winning numbers (5 numbers between 1-45)
    const winningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);

    const { error } = await supabase
      .from('draws')
      .update({
        status: 'simulated',
        winning_numbers: winningNumbers,
      })
      .eq('id', drawId);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/draws');
    return { success: true, message: 'Draw simulated successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function publishDraw(drawId: string): Promise<FormState> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('draws')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', drawId);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/draws');
    return { success: true, message: 'Draw published successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================
// WINNER MANAGEMENT
// ============================================

export async function getAllWinners(): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('winners')
      .select(
        `
        *,
        profiles(full_name, email),
        draws(draw_date)
      `
      )
      .order('created_at', { ascending: false });

    if (error) return { success: false, message: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateWinnerStatus(winnerId: string, input: WinnerActionInput): Promise<FormState> {
  try {
    const validatedData = winnerActionSchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase.from('winners').update(validatedData).eq('id', winnerId);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/winners');
    return { success: true, message: 'Winner status updated successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message };
  }
}

export async function payWinner(winnerId: string): Promise<FormState> {
  try {
    const supabase = await createClient();

    const { data: winner, error: winnerError } = await supabase
      .from('winners')
      .select('*, profiles(email)')
      .eq('id', winnerId)
      .single();

    if (winnerError) return { success: false, message: winnerError.message };

    // Update winner status to paid
    const { error } = await supabase
      .from('winners')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', winnerId);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/winners');
    return { success: true, message: 'Winner marked as paid' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
