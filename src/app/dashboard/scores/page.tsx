import React from 'react';
import { createClient } from '@/lib/supabase/server';
import ScoresPageClient from './client-page';

export default async function ScoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_date', { ascending: false })
    .limit(5);

  return <ScoresPageClient scores={scores || []} />;
}
