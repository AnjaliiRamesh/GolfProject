'use client';

import React, { useEffect, useState } from 'react';
import { getAllCharities, createCharity, updateCharity, deleteCharity } from '@/actions/admin.actions';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    category: '',
    logo_url: '',
    banner_url: '',
    website_url: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    const result = await getAllCharities();
    if (result.success) {
      setCharities(result.data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingId ? updateCharity : createCharity;
    const result = await action(editingId || 'new', formData);

    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        long_description: '',
        category: '',
        logo_url: '',
        banner_url: '',
        website_url: '',
        featured: false,
        active: true,
      });
      fetchCharities();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = (charity: any) => {
    setEditingId(charity.id);
    setFormData({
      name: charity.name,
      slug: charity.slug,
      description: charity.description || '',
      long_description: charity.long_description || '',
      category: charity.category || '',
      logo_url: charity.logo_url || '',
      banner_url: charity.banner_url || '',
      website_url: charity.website_url || '',
      featured: charity.featured,
      active: charity.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this charity?')) {
      const result = await deleteCharity(id);
      if (result.success) {
        toast.success(result.message);
        fetchCharities();
      } else {
        toast.error(result.message);
      }
    }
  };

  if (loading) {
    return <div>Loading charities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Charity Management</h1>
          <p className="text-muted-foreground mt-2">Manage partner charities</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)}>Add Charity</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Charity' : 'Add New Charity'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update charity information' : 'Create a new charity entry'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label>Long Description</Label>
                <Textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    type="url"
                  />
                </div>
                <div>
                  <Label>Banner URL</Label>
                  <Input
                    value={formData.banner_url}
                    onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                    type="url"
                  />
                </div>
              </div>

              <div>
                <Label>Website URL</Label>
                <Input
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  type="url"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Featured</Label>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Active</Label>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Charities</CardTitle>
          <CardDescription>Total charities: {charities.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Total Raised</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charities.map((charity) => (
                  <TableRow key={charity.id}>
                    <TableCell className="font-medium">{charity.name}</TableCell>
                    <TableCell>{charity.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={charity.active ? 'default' : 'secondary'}>
                        {charity.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {charity.featured ? <Badge variant="outline">Yes</Badge> : '-'}
                    </TableCell>
                    <TableCell>£{(charity.total_raised / 100).toFixed(2)}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(charity)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(charity.id)}
                      >
                        Delete
                      </Button>
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
