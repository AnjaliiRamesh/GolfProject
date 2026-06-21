import React from 'react';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, Zap, Shield } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              How GreenSwing Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the perfect blend of competitive golf and charitable giving. Get started in minutes.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Start Playing Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main How It Works */}
      <HowItWorks />

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Players Love GreenSwing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              It's more than just a game—it's a community with purpose.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Fair & Transparent</h3>
              <p className="text-muted-foreground">
                Using algorithmic and random draw modes, every player has an equal chance to win based on their actual golf performance.
              </p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Quick & Easy</h3>
              <p className="text-muted-foreground">
                Submit scores in seconds. Draws happen automatically. No complex rules or paperwork. Just golf.
              </p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Secure & Verified</h3>
              <p className="text-muted-foreground">
                Winners must verify their scores with official scorecards. Your transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Understanding Stableford Scoring</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-background rounded-lg border p-6">
                <h3 className="font-bold mb-4 text-lg">Score Range</h3>
                <p className="text-muted-foreground mb-4">
                  GreenSwing uses Stableford scoring, which rewards consistency and good play.
                </p>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-semibold">Min Score:</span> 1 point</li>
                  <li><span className="font-semibold">Max Score:</span> 45 points</li>
                  <li><span className="font-semibold">Typical Range:</span> 25-35 points</li>
                </ul>
              </div>

              <div className="bg-background rounded-lg border p-6">
                <h3 className="font-bold mb-4 text-lg">How It Works</h3>
                <p className="text-muted-foreground text-sm">
                  You submit your best Stableford score. The system keeps your 5 most recent scores active. 
                  When a draw happens, 5 numbers are drawn, and you win if your scores match.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-8">
              <h3 className="font-bold mb-4 text-lg">Prize Distribution</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">5 Matches</p>
                  <p className="text-2xl font-bold">Highest Prize</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">4 Matches</p>
                  <p className="text-2xl font-bold">Medium Prize</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">3 Matches</p>
                  <p className="text-2xl font-bold">Base Prize</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-primary text-primary-foreground rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-lg opacity-90 mb-8">
              Start competing today and make a difference with every game.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 hover:bg-primary-foreground/10">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
