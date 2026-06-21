import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CharityClientPage from './client-page';
import { Charity } from '@/types';

export default async function CharitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [charitiesRes, activeCharityRes] = await Promise.all([
    supabase.from('charities').select('*').eq('active', true).order('featured', { ascending: false }).order('name'),
    supabase.from('user_charities').select('*, charity:charities(*)').eq('user_id', user.id).eq('active', true).maybeSingle(),
  ]);

  return (
    <CharityClientPage 
      charities={(charitiesRes.data as Charity[]) || []} 
      activeCharity={activeCharityRes.data} 
    />
  );
}
