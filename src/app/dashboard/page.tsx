import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Activity, Gift, Heart, Trophy, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createCustomerPortalSession } from '@/actions/subscription.actions';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch dashboard data
  const [subscriptionRes, scoresRes, charityRes] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('scores').select('*').eq('user_id', user.id).order('played_date', { ascending: false }).limit(5),
    supabase.from('user_charities').select('*, charity:charities(*)').eq('user_id', user.id).eq('active', true).maybeSingle(),
  ]);

  const subscription = subscriptionRes.data;
  const scores = scoresRes.data || [];
  const activeCharity = charityRes.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's a summary of your performance and impact.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Subscription Status Card */}
        <Card className="glass-dark border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subscription ? (
              <>
                <div className="text-2xl font-bold capitalize text-primary">{subscription.status}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {subscription.plan_type} plan • Renews {formatDate(subscription.current_period_end)}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive">Inactive</div>
                <Button variant="link" className="p-0 h-auto text-xs mt-1" asChild>
                  <Link href="/pricing">Subscribe now</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Scores Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Scores</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.length}/5</div>
            <p className="text-xs text-muted-foreground mt-1">
              {scores.length === 5 ? 'Ready for next draw' : `Need ${5 - scores.length} more for draw`}
            </p>
          </CardContent>
        </Card>

        {/* Charity Impact Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Charity Impact</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeCharity ? (
              <>
                <div className="text-2xl font-bold">{activeCharity.contribution_percentage}%</div>
                <p className="text-xs text-muted-foreground mt-1 truncate" title={activeCharity.charity?.name}>
                  Supporting {activeCharity.charity?.name}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">Not set</div>
                <Button variant="link" className="p-0 h-auto text-xs mt-1" asChild>
                  <Link href="/dashboard/charities">Select a charity</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Winnings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              0 pending payouts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Scores</CardTitle>
            <CardDescription>Your latest 5 Stableford scores used for draws.</CardDescription>
          </CardHeader>
          <CardContent>
            {scores.length > 0 ? (
              <div className="space-y-4">
                {scores.map((score) => (
                  <div key={score.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="font-medium">{formatDate(score.played_date)}</div>
                    <div className="text-xl font-bold text-primary">{score.score} pts</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/dashboard/scores">Manage Scores</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't logged any scores yet.</p>
                <Button asChild>
                  <Link href="/dashboard/scores">Add Your First Score</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" /> Next Prize Draw
            </CardTitle>
            <CardDescription>End of the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {scores.length === 5 && subscription?.status === 'active' ? (
                <>
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">You're ready!</h3>
                  <p className="text-muted-foreground">
                    Your 5 scores are locked in and your subscription is active. Good luck!
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Action Required</h3>
                  <p className="text-muted-foreground mb-4">
                    To enter the next draw, you need an active subscription and 5 recorded scores.
                  </p>
                  <div className="flex gap-4">
                    {subscription?.status !== 'active' && (
                      <Button asChild variant="default">
                        <Link href="/pricing">Subscribe</Link>
                      </Button>
                    )}
                    {scores.length < 5 && (
                      <Button asChild variant={subscription?.status === 'active' ? 'default' : 'outline'}>
                        <Link href="/dashboard/scores">Add Scores</Link>
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
