'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PenSquare, Target, Trophy, Gift } from 'lucide-react';

const steps = [
  {
    title: 'Subscribe & Select',
    description: 'Choose your membership plan and select the charity you want to support with a percentage of your fee.',
    icon: Gift,
  },
  {
    title: 'Track Performance',
    description: 'Log your Stableford scores. The system automatically keeps your latest 5 scores active for draws.',
    icon: PenSquare,
  },
  {
    title: 'Monthly Draws',
    description: 'At the end of every month, 5 numbers are drawn. Match 3, 4, or 5 numbers to win a share of the prize pool.',
    icon: Target,
  },
  {
    title: 'Win & Verify',
    description: 'If you win, simply upload your official scorecard as proof. Once verified, the prize is yours.',
    icon: Trophy,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">The GreenSwing Flow</h2>
          <p className="text-lg text-muted-foreground">
            A seamless experience from the first tee to the final prize draw.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-border z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-6 group-hover:border-primary transition-colors group-hover:shadow-md">
                <step.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
