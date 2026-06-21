import { createAdminClient } from '@/lib/supabase/admin';
import { DrawMode, AlgoStrategy, DrawStatus } from '@/types';
import { PrizePoolService } from './prize-pool.service';
import { drawConfig } from '@/config/site';

export class DrawService {
  static async createDraw(month: number, year: number, mode: DrawMode, strategy?: AlgoStrategy, isSimulation = false) {
    const supabase = createAdminClient();
    
    // Check if draw already exists for this month/year/simulation state
    const { data: existingDraw } = await supabase
      .from('draws')
      .select('id')
      .eq('month', month)
      .eq('year', year)
      .eq('is_simulation', isSimulation)
      .maybeSingle();
      
    if (existingDraw) {
      throw new Error(`Draw already exists for ${month}/${year}`);
    }

    const { data: draw, error } = await supabase
      .from('draws')
      .insert({
        month,
        year,
        draw_date: new Date(`${year}-${month.toString().padStart(2, '0')}-28`).toISOString(), // End of month approx
        draw_mode: mode,
        algo_strategy: strategy || null,
        status: 'draft',
        is_simulation: isSimulation,
      })
      .select()
      .single();

    if (error) throw error;
    return draw;
  }

  static async runDraw(drawId: string) {
    const supabase = createAdminClient();
    
    // Fetch draw
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single();
      
    if (drawError) throw drawError;
    if (draw.status !== 'draft') throw new Error(`Draw cannot be run from status: ${draw.status}`);

    // Set status to running
    await supabase.from('draws').update({ status: 'running' }).eq('id', drawId);

    try {
      // 1. Collect Entries (users with active subscriptions and exactly 5 recent scores)
      const { data: activeSubs } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('status', 'active');
        
      const userIds = activeSubs?.map(s => s.user_id) || [];
      
      const entriesToCreate = [];
      const allScoresMap = new Map<number, number>(); // for algorithmic strategy
      
      for (const userId of userIds) {
        const { data: scores } = await supabase
          .from('scores')
          .select('score')
          .eq('user_id', userId)
          .order('played_date', { ascending: false })
          .limit(5);
          
        if (scores && scores.length === 5) {
          const scoreValues = scores.map(s => s.score);
          entriesToCreate.push({
            draw_id: drawId,
            user_id: userId,
            scores: scoreValues,
          });
          
          // Track frequency for algorithmic mode
          scoreValues.forEach(s => {
            allScoresMap.set(s, (allScoresMap.get(s) || 0) + 1);
          });
        }
      }
      
      if (entriesToCreate.length > 0) {
        await supabase.from('draw_entries').insert(entriesToCreate);
      }

      // 2. Generate Winning Numbers
      let winningNumbers: number[] = [];
      
      if (draw.draw_mode === 'random') {
        const pool = Array.from({ length: drawConfig.scoreRange.max }, (_, i) => i + 1);
        for (let i = 0; i < drawConfig.drawNumbers; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          winningNumbers.push(pool[idx]);
          pool.splice(idx, 1);
        }
      } else {
        // Algorithmic
        const sortedFrequencies = Array.from(allScoresMap.entries()).sort((a, b) => {
          if (draw.algo_strategy === 'most_frequent') return b[1] - a[1];
          return a[1] - b[1];
        });
        
        // Take top 5, or fallback to random if not enough unique scores
        winningNumbers = sortedFrequencies.slice(0, 5).map(f => f[0]);
        while (winningNumbers.length < 5) {
          const rand = Math.floor(Math.random() * drawConfig.scoreRange.max) + 1;
          if (!winningNumbers.includes(rand)) winningNumbers.push(rand);
        }
      }
      
      // Sort numbers for cleaner display
      winningNumbers.sort((a, b) => a - b);

      // 3. Match Entries
      const { data: entries } = await supabase
        .from('draw_entries')
        .select('*')
        .eq('draw_id', drawId);
        
      let matchCounts = { 5: 0, 4: 0, 3: 0 };
      
      if (entries) {
        for (const entry of entries) {
          const matchedCount = entry.scores.filter((s: number) => winningNumbers.includes(s)).length;
          
          if (matchedCount >= 3) {
            matchCounts[matchedCount as keyof typeof matchCounts]++;
            await supabase
              .from('draw_entries')
              .update({ matched_count: matchedCount, is_winner: true })
              .eq('id', entry.id);
          } else if (matchedCount > 0) {
            await supabase
              .from('draw_entries')
              .update({ matched_count: matchedCount })
              .eq('id', entry.id);
          }
        }
      }

      // 4. Calculate Prize Pool
      const pool = await PrizePoolService.calculateCurrentPool();
      let currentRollover = 0;
      if (!draw.is_simulation) {
        currentRollover = await PrizePoolService.getJackpotRollover();
      }
      
      // The 5-match pool gets the rollover
      let actualFiveMatchPool = pool.fiveMatchPool + currentRollover;
      
      // Check Jackpot Cap
      const { cappedAmount, excess } = await PrizePoolService.checkJackpotCap(actualFiveMatchPool);
      actualFiveMatchPool = cappedAmount;
      
      // Distribute excess (e.g. spread to lower tiers, or save for next month. Let's add to totalPool for tracking, but not distribute immediately as per standard lottery rules)
      
      // Calculate individual prizes
      const prizes = {
        5: matchCounts[5] > 0 ? Math.floor(actualFiveMatchPool / matchCounts[5]) : 0,
        4: matchCounts[4] > 0 ? Math.floor(pool.fourMatchPool / matchCounts[4]) : 0,
        3: matchCounts[3] > 0 ? Math.floor(pool.threeMatchPool / matchCounts[3]) : 0,
      };

      // Calculate new rollover (if no 5-match winners)
      const newRollover = matchCounts[5] === 0 ? actualFiveMatchPool : 0;

      // 5. Create Winners
      if (entries) {
        const winningEntries = entries.filter((e: any) => e.matched_count && e.matched_count >= 3);
        const winnersToCreate = winningEntries.map((e: any) => ({
          draw_id: drawId,
          draw_entry_id: e.id,
          user_id: e.user_id,
          draw_type: `${e.matched_count}_match`,
          prize_amount: prizes[e.matched_count as keyof typeof prizes],
          status: 'pending'
        }));
        
        if (winnersToCreate.length > 0) {
          await supabase.from('winners').insert(winnersToCreate);
        }
      }

      // 6. Finalize Draw Record
      const newStatus = draw.is_simulation ? 'simulated' : 'completed';
      await supabase.from('draws').update({
        status: newStatus,
        winning_numbers: winningNumbers,
        total_prize_pool: pool.totalPool,
        five_match_pool: actualFiveMatchPool,
        four_match_pool: pool.fourMatchPool,
        three_match_pool: pool.threeMatchPool,
        jackpot_rollover: newRollover,
        total_entries: entriesToCreate.length,
      }).eq('id', drawId);

      return { success: true };
    } catch (error) {
      // Revert status on failure
      await supabase.from('draws').update({ status: 'draft' }).eq('id', drawId);
      throw error;
    }
  }

  static async publishDraw(drawId: string) {
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('draws')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', drawId)
      .eq('status', 'completed')
      .eq('is_simulation', false);
      
    if (error) throw error;
    
    // In a real implementation, this would queue emails to all participants and winners
    return { success: true };
  }
}
