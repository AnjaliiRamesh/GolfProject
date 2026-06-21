import { NextResponse } from 'next/server';
import { DrawService } from '@/services/draw.service';
import { createAdminClient } from '@/lib/supabase/admin';

// This endpoint should be triggered by a Vercel Cron or similar scheduler
// Ensure you secure this endpoint with a secret token in production

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();

    // 1. Create the draw
    const draw = await DrawService.createDraw(month, year, 'random', undefined, false);

    // 2. Run the draw
    await DrawService.runDraw(draw.id);

    // 3. Publish the draw (in a real app, you might want to review before publishing)
    await DrawService.publishDraw(draw.id);

    return NextResponse.json({ success: true, drawId: draw.id });
  } catch (error: any) {
    console.error('Automated draw error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
