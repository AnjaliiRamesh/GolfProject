'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subscriptionPlans } from '@/config/site';
import { createCheckoutSession } from '@/actions/subscription.actions';
import { toast } from 'sonner';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<'monthly' | 'yearly' | null>(null);

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    setIsLoading(planType);
    try {
      const result = await createCheckoutSession(planType);
      if (!result.error && result.data) {
        // Redirect to Stripe checkout
        window.location.href = result.data;
      } else {
        toast.error(result.message || 'Failed to initialize checkout');
        setIsLoading(null);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsLoading(null);
    }
  };

  return (
    <div className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground">
            Join GreenSwing today. A portion of your subscription automatically goes to the charity of your choice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(subscriptionPlans).map(([key, plan], index) => {
            const isYearly = key === 'yearly';
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border ${
                  isYearly ? 'border-primary shadow-lg shadow-primary/10 bg-background' : 'bg-muted/30 border-border'
                }`}
              >
                {('badge' in plan) && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {(plan as any).badge}
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.priceDisplay}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full h-12 text-lg rounded-xl" 
                  variant={isYearly ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(key as 'monthly' | 'yearly')}
                  disabled={isLoading !== null}
                >
                  {isLoading === key ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
