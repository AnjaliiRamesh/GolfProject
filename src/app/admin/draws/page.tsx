'use client';

import React, { useEffect, useState } from 'react';
import { getAllDraws, createDraw, simulateDraw, publishDraw } from '@/actions/admin.actions';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function DrawsPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    draw_date: new Date().toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    draw_mode: 'random' as 'random' | 'algorithmic',
    algo_strategy: undefined as 'most_frequent' | 'least_frequent' | undefined,
  });

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    const result = await getAllDraws();
    if (result.success) {
      setDraws(result.data || []);
    }
    setLoading(false);
  };

  const handleCreateDraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createDraw(formData);

    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setFormData({
        draw_date: new Date().toISOString().split('T')[0],
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        draw_mode: 'random',
        algo_strategy: undefined,
      });
      fetchDraws();
    } else {
      toast.error(result.message);
    }
  };

  const handleSimulate = async (drawId: string) => {
    if (window.confirm('Simulate this draw?')) {
      const result = await simulateDraw(drawId);
      if (result.success) {
        toast.success(result.message);
        fetchDraws();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handlePublish = async (drawId: string) => {
    if (window.confirm('Publish this draw? This will make it visible to users.')) {
      const result = await publishDraw(drawId);
      if (result.success) {
        toast.success(result.message);
        fetchDraws();
      } else {
        toast.error(result.message);
      }
    }
  };

  if (loading) {
    return <div>Loading draws...</div>;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      draft: 'secondary',
      simulated: 'outline',
      running: 'default',
      completed: 'default',
      published: 'default',
    };
    return colors[status] || 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draw Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage draws</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>Create Draw</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Draw</DialogTitle>
              <DialogDescription>Set up a new lottery draw</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateDraw} className="space-y-4">
              <div>
                <Label>Draw Date *</Label>
                <Input
                  type="date"
                  value={formData.draw_date}
                  onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Month *</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(val) =>
                      setFormData({ ...formData, month: parseInt(val) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {new Date(2024, m - 1).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Year *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Draw Mode *</Label>
                <Select
                  value={formData.draw_mode}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      draw_mode: val as 'random' | 'algorithmic',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="algorithmic">Algorithmic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.draw_mode === 'algorithmic' && (
                <div>
                  <Label>Algorithm Strategy *</Label>
                  <Select
                    value={formData.algo_strategy || ''}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        algo_strategy: val as 'most_frequent' | 'least_frequent',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most_frequent">Most Frequent Scores</SelectItem>
                      <SelectItem value="least_frequent">Least Frequent Scores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draws</CardTitle>
          <CardDescription>Total draws: {draws.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Winners</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draws.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="text-sm">
                      {new Date(draw.draw_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{`${draw.month}/${draw.year}`}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{draw.draw_mode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(draw.status)}>{draw.status}</Badge>
                    </TableCell>
                    <TableCell>{draw.total_entries}</TableCell>
                    <TableCell>£{(draw.total_prize_pool / 100).toFixed(2)}</TableCell>
                    <TableCell className="space-x-2">
                      {draw.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSimulate(draw.id)}
                        >
                          Simulate
                        </Button>
                      )}
                      {draw.status === 'simulated' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(draw.id)}
                        >
                          Publish
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
    </div>
  );
}
