import { NextResponse } from 'next/server';
import { DrawService } from '@/services/draw.service';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendBulkDrawResultsEmails } from '@/lib/email/service';

// This endpoint should be triggered by a scheduled job (Vercel Cron, AWS Lambda, etc.)
// Typically runs on the 28th of each month
// Ensure this endpoint is secured with CRON_SECRET in production

export async function POST(req: Request) {
  try {
    // Verify the request is from a trusted cron source
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();

    // 1. Check if draw already exists for this month
    const supabase = createAdminClient();
    const { data: existingDraw } = await supabase
      .from('draws')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .eq('is_simulation', false)
      .maybeSingle();

    if (existingDraw && existingDraw.status === 'published') {
      return NextResponse.json({
        message: 'Draw already published for this month',
        drawId: existingDraw.id,
      });
    }

    // 2. Create the draw if it doesn't exist
    let draw = existingDraw;
    if (!draw) {
      draw = await DrawService.createDraw(month, year, 'random', undefined, false);
    }

    // 3. Run the draw (generate winning numbers, match entries, create winners)
    await DrawService.runDraw(draw.id);

    // 4. Send emails to all participants with results
    const { data: entries } = await supabase
      .from('draw_entries')
      .select(`
        scores,
        matched_count,
        is_winner,
        profiles(email, full_name)
      `)
      .eq('draw_id', draw.id);

    if (entries && entries.length > 0) {
      const emailsToSend = entries.map((entry: any) => ({
        email: entry.profiles?.email,
        fullName: entry.profiles?.full_name || 'Player',
        drawDate: draw.draw_date,
        winningNumbers: draw.winning_numbers,
        userMatches: entry.matched_count,
        hasPrize: entry.is_winner,
      }));

      await sendBulkDrawResultsEmails(emailsToSend);
    }

    // 5. Publish the draw
    await DrawService.publishDraw(draw.id);

    return NextResponse.json({
      success: true,
      message: 'Draw completed successfully',
      draw: {
        id: draw.id,
        month,
        year,
        winningNumbers: draw.winning_numbers,
        totalEntries: draw.total_entries,
        participantEmails: entries?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Automated draw cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process draw',
      },
      { status: 500 }
    );
  }
}
