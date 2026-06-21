import React from 'react';
import { createClient } from '@/lib/supabase/server';
import WinningsClientPage from './client-page';

export default async function WinningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: winnings } = await supabase
    .from('winners')
    .select(`
      *,
      draw:draws(draw_date, month, year, winning_numbers),
      proofs:winner_proofs(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <WinningsClientPage winnings={winnings || []} />;
}
