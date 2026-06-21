'use server';

import { createClient } from '@/lib/supabase/server';
import { scoreSchema, ScoreInput, UpdateScoreInput, updateScoreSchema } from '@/validators/score.schema';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { sendScoreConfirmationEmail } from '@/lib/email/service';

export async function addScore(data: ScoreInput): Promise<ApiResponse> {
  try {
    const validatedData = scoreSchema.parse(data);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    // DB trigger handles the max 5 scores logic, but we still need to insert
    const { error } = await supabase.from('scores').insert({
      user_id: user.id,
      score: validatedData.score,
      played_date: validatedData.played_date,
    });

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { error: 'You already have a score recorded for this date.' };
      }
      throw error;
    }

    // Send score confirmation email
    if (profile?.email) {
      await sendScoreConfirmationEmail(
        profile.email,
        profile.full_name || 'User',
        validatedData.score,
        validatedData.played_date
      );
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/scores');
    
    return { message: 'Score added successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') return { error: 'Validation failed' };
    return { error: error.message || 'Failed to add score' };
  }
}

export async function deleteScore(id: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Extra security check

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/scores');
    
    return { message: 'Score deleted successfully' };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete score' };
  }
}

export async function updateScore(data: UpdateScoreInput): Promise<ApiResponse> {
  try {
    const validatedData = updateScoreSchema.parse(data);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('scores')
      .update({ score: validatedData.score })
      .eq('id', validatedData.id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/scores');
    
    return { message: 'Score updated successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') return { error: 'Validation failed' };
    return { error: error.message || 'Failed to update score' };
  }
}
