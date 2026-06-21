import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Target, Users, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              About GreenSwing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Where passion for golf meets purpose. We're building a community that plays competitive golf while making real charitable impact.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                GreenSwing was founded on a simple belief: golf is more than just a game. It's a passion that brings people together, 
                and that passion should mean something.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We created GreenSwing to give every golfer the opportunity to compete at a premium level while simultaneously supporting 
                charities they care about. Every subscription. Every score. Every win. It all matters.
              </p>
              <p className="text-lg text-muted-foreground">
                Our platform combines fair competition with transparent charitable giving, creating a win-win for players and communities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-sm text-muted-foreground">Active Players</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">£1M+</div>
                <p className="text-sm text-muted-foreground">Raised for Charity</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Charity Partners</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Verified Winners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Our Core Values</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Fair Competition</h3>
              <p className="text-muted-foreground text-sm">
                Every player has an equal chance to win based on their genuine golf performance.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Charitable Impact</h3>
              <p className="text-muted-foreground text-sm">
                Every transaction directly supports meaningful charitable work in communities worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Community First</h3>
              <p className="text-muted-foreground text-sm">
                We're building a community of passionate golfers united by purpose and integrity.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Transparency</h3>
              <p className="text-muted-foreground text-sm">
                All draws, transactions, and charitable distributions are fully transparent and verifiable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Team</h2>
          <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
            Built by golf enthusiasts, technology experts, and charitable advocates who share a common vision: 
            making golf matter beyond the course.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                title: 'Founder & CEO',
                bio: 'Former golf pro turned entrepreneur. Founded GreenSwing after 15 years in competitive golf.',
              },
              {
                name: 'Marcus Johnson',
                title: 'CTO',
                bio: 'Full-stack engineer with 10+ years experience. Passionate about building fair systems.',
              },
              {
                name: 'Emily Rodriguez',
                title: 'Head of Charities',
                bio: 'Nonprofit strategist dedicated to maximizing charitable impact and community engagement.',
              },
            ].map((member, i) => (
              <div key={i} className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.title}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity Impact */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Our Charitable Impact</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-lg border p-8">
              <h3 className="font-bold text-xl mb-4">How It Works</h3>
              <p className="text-muted-foreground">
                Players choose which charities to support with their subscription. We distribute funds quarterly based on player selections 
                and tournament winnings.
              </p>
            </div>

            <div className="bg-background rounded-lg border p-8">
              <h3 className="font-bold text-xl mb-4">Transparency</h3>
              <p className="text-muted-foreground">
                Every transaction is tracked. Players can see exactly how much their contributions have raised for their chosen charities.
              </p>
            </div>

            <div className="bg-background rounded-lg border p-8">
              <h3 className="font-bold text-xl mb-4">Vetting Process</h3>
              <p className="text-muted-foreground">
                We partner only with registered, verified charities. All distributions are audited and documented for complete accountability.
              </p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-8 text-center">
            <h3 className="font-bold text-2xl mb-4">Browse Our Charity Partners</h3>
            <p className="text-muted-foreground mb-6">
              Explore the organizations we work with and choose the ones that matter most to you.
            </p>
            <Button asChild size="lg">
              <Link href="/charities">View Charities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-primary text-primary-foreground rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
            <p className="text-lg opacity-90 mb-8">
              Be part of a community that plays golf with purpose. Make a difference, one score at a time.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
