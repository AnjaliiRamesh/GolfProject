import { createAdminClient } from '@/lib/supabase/admin';
import { PRIZE_DISTRIBUTION } from '@/config/constants';
import { drawConfig } from '@/config/site';

const PRIZE_CONTRIBUTION_PER_USER = 200; // £2.00 per active subscriber goes to the prize pool

export class PrizePoolService {
  static async calculateCurrentPool(): Promise<{
    totalPool: number;
    fiveMatchPool: number;
    fourMatchPool: number;
    threeMatchPool: number;
    activeSubscribers: number;
  }> {
    const supabase = createAdminClient();
    
    // Count active subscribers
    const { count } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
      
    const activeSubscribers = count || 0;
    const totalPool = activeSubscribers * PRIZE_CONTRIBUTION_PER_USER;
    
    const fiveMatchPool = Math.floor(totalPool * PRIZE_DISTRIBUTION.FIVE_MATCH);
    const fourMatchPool = Math.floor(totalPool * PRIZE_DISTRIBUTION.FOUR_MATCH);
    const threeMatchPool = Math.floor(totalPool * PRIZE_DISTRIBUTION.THREE_MATCH);
    
    return {
      totalPool,
      fiveMatchPool,
      fourMatchPool,
      threeMatchPool,
      activeSubscribers
    };
  }
  
  static async getJackpotRollover(): Promise<number> {
    const supabase = createAdminClient();
    
    // Get the most recent completed draw to check for rollover
    const { data: lastDraw } = await supabase
      .from('draws')
      .select('jackpot_rollover')
      .in('status', ['completed', 'published'])
      .eq('is_simulation', false)
      .order('draw_date', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    return lastDraw?.jackpot_rollover || 0;
  }
  
  static async checkJackpotCap(amount: number): Promise<{
    cappedAmount: number;
    excess: number;
  }> {
    const supabase = createAdminClient();
    
    // Fetch cap from system settings
    const { data: setting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'jackpot_cap')
      .single();
      
    const cap = setting ? parseInt(setting.value, 10) : drawConfig.jackpotCap;
    
    if (amount > cap) {
      return {
        cappedAmount: cap,
        excess: amount - cap,
      };
    }
    
    return {
      cappedAmount: amount,
      excess: 0,
    };
  }
}
