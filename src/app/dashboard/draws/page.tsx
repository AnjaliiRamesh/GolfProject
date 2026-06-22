'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trophy, Calendar } from 'lucide-react';
import { TableSkeleton } from '@/components/shared/loading-skeletons';
import { getUserDrawHistory } from '@/actions/draw.actions';
// import { createClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/client';

interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  scores: number[];
  matched_count: number;
  is_winner: boolean;
  created_at: string;
  draws: {
    id: string;
    draw_date: string;
    month: number;
    year: number;
    winning_numbers: number[];
    draw_mode: string;
    status: string;
    total_prize_pool: number;
  };
}

export default function DrawHistoryPage() {
  const [entries, setEntries] = useState<DrawEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<DrawEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function fetchDrawHistory() {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('draw_entries')
          .select(`
            *,
            draws(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setEntries(data as DrawEntry[]);
        }
      }
      setLoading(false);
    }

    fetchDrawHistory();
  }, []);

  const handleViewDetails = (entry: DrawEntry) => {
    setSelectedEntry(entry);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draw History</h1>
          <p className="text-muted-foreground mt-2">Your participation in monthly draws</p>
        </div>
        <TableSkeleton rows={10} />
      </div>
    );
  }

  const winningEntries = entries.filter((e) => e.is_winner);
  const totalMatches = entries.reduce((sum, e) => sum + e.matched_count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Draw History</h1>
        <p className="text-muted-foreground mt-2">Your participation in monthly draws</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">Draws participated in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wins</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winningEntries.length}</div>
            <p className="text-xs text-muted-foreground">Total wins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
            <p className="text-xs text-muted-foreground">Score matches across all draws</p>
          </CardContent>
        </Card>
      </div>

      {/* Draw History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Entries</CardTitle>
          <CardDescription>View your participation history</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No draw entries yet. Submit scores to join draws.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Draw Date</TableHead>
                    <TableHead>Your Scores</TableHead>
                    <TableHead>Winning Numbers</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {new Date(entry.draws.draw_date).toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {entry.scores.map((score, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center justify-center w-8 h-8 rounded bg-muted text-sm font-medium"
                            >
                              {score}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {entry.draws.winning_numbers?.map((num, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium ${
                                entry.scores.includes(num)
                                  ? 'bg-primary/20 text-primary font-bold'
                                  : 'bg-muted'
                              }`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.matched_count >= 3 ? 'default' : 'secondary'}>
                          {entry.matched_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.is_winner ? (
                          <Badge variant="default" className="bg-green-600">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        ) : entry.matched_count >= 3 ? (
                          <Badge variant="outline">Prize Won</Badge>
                        ) : (
                          <Badge variant="secondary">Participated</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(entry)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draw Entry Details</DialogTitle>
            <DialogDescription>
              Draw from {new Date(selectedEntry?.draws.draw_date || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              {/* Draw Info */}
              <div>
                <h3 className="font-semibold mb-3">Draw Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Draw Date</p>
                    <p className="font-medium">
                      {new Date(selectedEntry.draws.draw_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Draw Mode</p>
                    <p className="font-medium capitalize">{selectedEntry.draws.draw_mode}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedEntry.draws.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prize Pool</p>
                    <p className="font-medium">
                      £{(selectedEntry.draws.total_prize_pool / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score Matching */}
              <div>
                <h3 className="font-semibold mb-3">Score Matching</h3>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Your Scores</p>
                    <div className="flex gap-2">
                      {selectedEntry.scores.map((score, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center w-8 h-8 rounded bg-background text-sm font-medium"
                        >
                          {score}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Winning Numbers</p>
                    <div className="flex gap-2">
                      {selectedEntry.draws.winning_numbers?.map((num, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium ${
                            selectedEntry.scores.includes(num)
                              ? 'bg-primary/20 text-primary font-bold'
                              : 'bg-background'
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div>
                <h3 className="font-semibold mb-3">Result</h3>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Matches: {selectedEntry.matched_count}</p>
                  {selectedEntry.is_winner && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <Trophy className="h-4 w-4" />
                      You won a prize!
                    </div>
                  )}
                  {selectedEntry.matched_count >= 3 && !selectedEntry.is_winner && (
                    <p className="text-sm text-amber-600 font-medium">
                      Congratulations! You matched {selectedEntry.matched_count} numbers and won a prize.
                    </p>
                  )}
                  {selectedEntry.matched_count < 3 && (
                    <p className="text-sm text-muted-foreground">
                      Better luck next time! Keep submitting scores.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
