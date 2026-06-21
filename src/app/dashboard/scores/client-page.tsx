'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scoreSchema, ScoreInput } from '@/validators/score.schema';
import { addScore, deleteScore, updateScore } from '@/actions/score.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Trash2, Edit2, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ScoresPage({ scores = [] }: { scores?: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScoreInput>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      played_date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: ScoreInput) => {
    setIsLoading(true);
    const result = await addScore(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
      reset({ played_date: new Date().toISOString().split('T')[0], score: undefined });
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteScore(id);
    setDeletingId(null);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Scores</h1>
        <p className="text-muted-foreground mt-2">
          Track your Stableford scores. We automatically keep your 5 most recent scores for the monthly draw.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Your scores are archived indefinitely, but only the 5 most recent rounds are used to enter you into the monthly prize draw. 
          When you add a 6th score, the oldest of the 5 is removed from your active draw entry.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Add New Score</CardTitle>
            <CardDescription>Enter a valid Stableford score (1-45).</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="played_date">Date Played</Label>
                <Input
                  id="played_date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  {...register('played_date')}
                  className={errors.played_date ? 'border-destructive' : ''}
                />
                {errors.played_date && (
                  <p className="text-sm text-destructive">{errors.played_date.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="score">Stableford Score</Label>
                <Input
                  id="score"
                  type="number"
                  min={1}
                  max={45}
                  placeholder="36"
                  {...register('score', { valueAsNumber: true })}
                  className={errors.score ? 'border-destructive' : ''}
                />
                {errors.score && (
                  <p className="text-sm text-destructive">{errors.score.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Score
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Active Scores</CardTitle>
            <CardDescription>These 5 scores will be used in the next draw.</CardDescription>
          </CardHeader>
          <CardContent>
            {scores.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.map((score) => (
                    <TableRow key={score.id}>
                      <TableCell>{formatDate(score.played_date)}</TableCell>
                      <TableCell className="font-bold text-primary">{score.score} pts</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(score.id)}
                          disabled={deletingId === score.id}
                        >
                          {deletingId === score.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                No scores recorded yet. Add your first score to get started!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
