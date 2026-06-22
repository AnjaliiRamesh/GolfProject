'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Search, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GridSkeleton } from '@/components/shared/loading-skeletons';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // async function fetchCharities() {
    //   const supabase = createClient();
    //   const { data, error } = await supabase
    //     .from('charities')
    //     .select('*')
    //     .eq('active', true)
    //     .order('featured', { ascending: false })
    //     .order('created_at', { ascending: false });

    //     console.log('Charities Data:', data);
    //     console.log('Charities Error:', error);

    //   setCharities(data || []);
    //   setLoading(false);
    // }


//     async function fetchCharities() {
//     try {
//     console.log('fetchCharities started');

//     const supabase = createClient();

//     console.log('before query');

//     const result = await Promise.race([
//       supabase
//         .from('charities')
//         .select('*')
//         .eq('active', true)
//         .order('featured', { ascending: false }),

//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error('query timeout')), 5000)
//       ),
//     ]);

//     console.log('query result:', result);

//     const { data, error } = result as any;

//     console.log('Charities Data:', data);
//     console.log('Charities Error:', error);

//     setCharities(data || []);
//   } catch (err) {
//     console.error('fetchCharities failed:', err);
//   } finally {
//     console.log('setting loading false');
//     setLoading(false);
//   }
// }

// async function fetchCharities() {
//   console.log("fetch started");

//   const supabase = createClient();

//   const result = await supabase
//     .from("charities")
//     .select("id,name");

//   console.log("RESULT:", result);

//   setLoading(false);
// }

async function fetchCharities() {
  console.log("fetch started");

  const supabase = createClient();

  const { data, error } = await supabase
.from("charities")
    .select("*")
    // .eq("active", true)
    // .order("featured", { ascending: false });

  console.log("DATA:", data);
  console.log("ERROR:", error);
   console.log("ERROR:", error);

  if (!error) {
    setCharities(data || []);
  }

  setLoading(false);
}

    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(
    (charity) =>
      charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charity.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Our Charity Partners
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every game you play supports real causes
            </p>
          </div>
          <GridSkeleton cols={3} items={9} />
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our Charity Partners
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            When you play GreenSwing, you're not just competing—you're making a real difference.
            Support charities that matter to you with every game.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search charities by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Charities Grid */}
        <div className="mb-4 text-red-500">
  Total charities loaded: {charities.length}
</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((charity) => (
            <Card key={charity.id} className="flex flex-col hover:shadow-lg transition-shadow">
              {charity.banner_url && (
                <div className="w-full h-40 bg-muted overflow-hidden rounded-t-lg">
                  <img
                    src={charity.banner_url}
                    alt={charity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle>{charity.name}</CardTitle>
                    {charity.category && (
                      <CardDescription className="mt-1">{charity.category}</CardDescription>
                    )}
                  </div>
                  {charity.featured && (
                    <Badge variant="default" className="flex gap-1">
                      <Heart className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground">{charity.description}</p>

                {charity.total_raised > 0 && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Raised</p>
                    <p className="text-lg font-bold">£{(charity.total_raised / 100).toFixed(2)}</p>
                  </div>
                )}

                {charity.website_url && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href={charity.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCharities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No charities found matching your search.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-primary/5 border border-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join GreenSwing today and start supporting these amazing charities with every game you play.
          </p>
          <Button size="lg" asChild>
            <a href="/signup">Get Started</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
