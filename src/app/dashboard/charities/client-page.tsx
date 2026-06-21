'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectCharityInput, selectCharitySchema } from '@/validators/charity.schema';
import { selectUserCharity, createDonationCheckoutSession } from '@/actions/charity.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Heart, Loader2, Search, ExternalLink } from 'lucide-react';
import { Charity, UserCharity } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CONTRIBUTION_PERCENTAGES } from '@/config/constants';

interface CharityClientPageProps {
  charities: Charity[];
  activeCharity: UserCharity | null;
}

export default function CharityClientPage({ charities, activeCharity }: CharityClientPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDonating, setIsDonating] = useState<string | null>(null);
  const [donationAmounts, setDonationAmounts] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SelectCharityInput>({
    resolver: zodResolver(selectCharitySchema),
    defaultValues: {
      charity_id: activeCharity?.charity_id || '',
      contribution_percentage: activeCharity?.contribution_percentage || 10,
    }
  });

  const selectedCharityId = watch('charity_id');

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const onSubmit = async (data: SelectCharityInput) => {
    setIsLoading(true);
    const result = await selectUserCharity(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
  };

  const handleDonate = async (charityId: string) => {
    const amountStr = donationAmounts[charityId];
    const amount = parseInt(amountStr as any, 10);
    
    if (!amount || amount < 1) {
      toast.error('Minimum donation is £1.00');
      return;
    }

    setIsDonating(charityId);
    const result = await createDonationCheckoutSession({
      charity_id: charityId,
      amount: amount * 100, // convert to pence
    });
    setIsDonating(null);

    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      window.location.href = result.data;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Charity Impact</h1>
        <p className="text-muted-foreground mt-2">
          Select which charity receives a portion of your subscription fee. You can also make independent one-time donations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> Active Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeCharity ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Currently supporting</div>
                    <div className="font-bold text-lg">{activeCharity.charity?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Contribution from subscription</div>
                    <div className="font-bold text-2xl text-primary">{activeCharity.contribution_percentage}%</div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  You haven't selected a charity yet. Choose one from the list to start making an impact.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Settings</CardTitle>
              <CardDescription>Change your supported charity or contribution percentage.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="charity-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-3">
                  <Label>Contribution Percentage</Label>
                  <RadioGroup 
                    defaultValue={activeCharity?.contribution_percentage?.toString() || "10"}
                    onValueChange={(val) => setValue('contribution_percentage', parseInt(val))}
                    className="flex flex-wrap gap-2"
                  >
                    {CONTRIBUTION_PERCENTAGES.map((pct) => (
                      <div key={pct} className="flex items-center space-x-2">
                        <RadioGroupItem value={pct.toString()} id={`pct-${pct}`} className="peer sr-only" />
                        <Label
                          htmlFor={`pct-${pct}`}
                          className="flex h-10 w-14 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                        >
                          {pct}%
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground mt-2">
                    This percentage of your subscription fee will be donated automatically.
                  </p>
                </div>

                {selectedCharityId && (
                  <input type="hidden" {...register('charity_id')} />
                )}
                
                {errors.charity_id && (
                  <p className="text-sm text-destructive">{errors.charity_id.message as string}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || !selectedCharityId}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search charities..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredCharities.map((charity) => (
              <Card 
                key={charity.id} 
                className={`overflow-hidden transition-all duration-200 cursor-pointer ${
                  selectedCharityId === charity.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                }`}
                onClick={() => setValue('charity_id', charity.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{charity.name}</CardTitle>
                    {charity.featured && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  {charity.category && (
                    <CardDescription>{charity.category}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {charity.description}
                  </p>
                  
                  <div className="pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                    <Label className="text-xs mb-2 block">One-time Donation (Optional)</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="0.00" 
                          className="pl-7 h-9"
                          value={donationAmounts[charity.id] || ''}
                          onChange={(e) => setDonationAmounts({...donationAmounts, [charity.id]: parseFloat(e.target.value)})}
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        disabled={isDonating === charity.id || !donationAmounts[charity.id]}
                        onClick={() => handleDonate(charity.id)}
                      >
                        {isDonating === charity.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Donate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredCharities.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                No charities found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
