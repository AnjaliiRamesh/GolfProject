'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trophy, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WinningsClientPage({ winnings }: { winnings: any[] }) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleFileUpload = async (winnerId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingId(winnerId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${winnerId}/${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('scorecards')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('scorecards')
        .getPublicUrl(fileName);

      // Create proof record
      const { error: proofError } = await supabase.from('winner_proofs').insert({
        winner_id: winnerId,
        user_id: user.id,
        file_url: publicUrlData.publicUrl,
        file_name: file.name,
        file_type: file.type,
      });

      if (proofError) throw proofError;

      // Update winner status
      await supabase.from('winners').update({ status: 'proof_uploaded' }).eq('id', winnerId);

      toast.success('Scorecard uploaded successfully. Admin will review it shortly.');
      // In a real app, we'd router.refresh() here
      window.location.reload();
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploadingId(null);
    }
  };

  const totalWon = winnings.reduce((sum, w) => sum + w.prize_amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Winnings</h1>
        <p className="text-muted-foreground mt-2">
          View your past winnings, upload scorecard proofs, and track payout statuses.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20 md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{formatCurrency(totalWon)}</div>
            <p className="text-sm text-muted-foreground mt-2">From {winnings.length} prize draws</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>How Payouts Work</CardTitle>
            <CardDescription>Follow these steps to claim your prize.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mb-3">1</div>
              <p className="text-sm">Win a monthly draw</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mb-3">2</div>
              <p className="text-sm">Upload your official scorecard</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mb-3">3</div>
              <p className="text-sm">Admin verifies and pays out</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold pt-4">Prize History</h2>
      
      {winnings.length > 0 ? (
        <div className="space-y-4">
          {winnings.map((winner) => (
            <Card key={winner.id} className="overflow-hidden">
              <div className="grid md:grid-cols-4 gap-4 p-6 items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Draw Date</p>
                  <p className="font-semibold">{formatDate(winner.draw?.draw_date)}</p>
                  <p className="text-xs text-muted-foreground">Month {winner.draw?.month}, {winner.draw?.year}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Match Type</p>
                  <p className="font-semibold capitalize">{winner.draw_type.replace('_', ' ')}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Prize Amount</p>
                  <p className="font-bold text-xl text-primary">{formatCurrency(winner.prize_amount)}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={winner.status} />
                  
                  {winner.status === 'pending' && (
                    <div className="mt-2 text-right">
                      <Label htmlFor={`upload-${winner.id}`} className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                        {uploadingId === winner.id ? 'Uploading...' : 'Upload Scorecard'}
                        <Upload className="ml-2 h-4 w-4" />
                      </Label>
                      <Input 
                        id={`upload-${winner.id}`} 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(winner.id, e)}
                        disabled={uploadingId === winner.id}
                      />
                    </div>
                  )}
                  
                  {winner.proofs && winner.proofs.length > 0 && (
                    <a 
                      href={winner.proofs[0].file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center mt-2"
                    >
                      <FileText className="h-3 w-3 mr-1" /> View Uploaded Proof
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/10 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No winnings yet</h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              Keep playing and recording your Stableford scores! Match 3 or more numbers in our monthly draws to win.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Action Required</Badge>;
    case 'proof_uploaded':
      return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3"/> Under Review</Badge>;
    case 'approved':
      return <Badge variant="outline" className="text-amber-500 border-amber-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved, Pending Payout</Badge>;
    case 'paid':
      return <Badge variant="default" className="bg-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Paid</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Proof Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
