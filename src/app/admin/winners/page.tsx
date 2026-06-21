'use client';

import React, { useEffect, useState } from 'react';
import { getAllWinners, updateWinnerStatus, payWinner } from '@/actions/admin.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    const result = await getAllWinners();
    if (result.success) {
      setWinners(result.data || []);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedWinner) return;

    const result = await updateWinnerStatus(selectedWinner.id, {
      status: newStatus as any,
      notes: notes || undefined,
    });

    if (result.success) {
      toast.success(result.message);
      setShowDialog(false);
      setNewStatus('');
      setNotes('');
      fetchWinners();
    } else {
      toast.error(result.message);
    }
  };

  const handlePayWinner = async (winnerId: string) => {
    if (window.confirm('Mark this winner as paid?')) {
      const result = await payWinner(winnerId);
      if (result.success) {
        toast.success(result.message);
        fetchWinners();
      } else {
        toast.error(result.message);
      }
    }
  };

  if (loading) {
    return <div>Loading winners...</div>;
  }

  const getStatusColor = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const colors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      pending: 'secondary',
      proof_uploaded: 'outline',
      approved: 'default',
      rejected: 'destructive',
      paid: 'default',
    };
    return colors[status] || 'secondary';
  };

  const pendingCount = winners.filter((w) => w.status === 'pending').length;
  const approvedCount = winners.filter((w) => w.status === 'approved').length;
  const paidCount = winners.filter((w) => w.status === 'paid').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Winner Management</h1>
        <p className="text-muted-foreground mt-2">Verify, approve, and manage winners</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Winners List</CardTitle>
          <CardDescription>Total winners: {winners.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Draw Type</TableHead>
                  <TableHead>Prize Amount</TableHead>
                  <TableHead>Draw Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winners.map((winner) => (
                  <TableRow key={winner.id}>
                    <TableCell className="font-medium">
                      {winner.profiles?.full_name || 'N/A'}
                    </TableCell>
                    <TableCell>{winner.profiles?.email}</TableCell>
                    <TableCell>{winner.draw_type}</TableCell>
                    <TableCell className="font-semibold">
                      £{(winner.prize_amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(winner.draws?.draw_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(winner.status)}>
                        {winner.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedWinner(winner);
                          setNewStatus(winner.status);
                          setNotes('');
                          setShowDialog(true);
                        }}
                      >
                        Review
                      </Button>
                      {winner.status === 'approved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePayWinner(winner.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Winner</DialogTitle>
            <DialogDescription>
              Update winner status: {selectedWinner?.profiles?.full_name}
            </DialogDescription>
          </DialogHeader>

          {selectedWinner && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Prize Amount</p>
                <p className="font-semibold">£{(selectedWinner.prize_amount / 100).toFixed(2)}</p>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="proof_uploaded">Proof Uploaded</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add notes about this winner..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus}>Update Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
