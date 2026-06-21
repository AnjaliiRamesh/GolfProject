'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight, Heart, Medal, Activity } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-8 text-sm font-medium"
        >
          <Trophy className="h-4 w-4" />
          <span>The Premium Golf Community</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 font-sans max-w-4xl mx-auto"
        >
          Elevate your game. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
            Impact the world.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join the exclusive platform where tracking your Stableford scores enters you into monthly luxury prize draws, all while supporting charities that matter to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto" asChild>
            <Link href="/signup">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto" asChild>
            <Link href="/how-it-works">
              How It Works
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 pt-10 border-t grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: 'Active Golfers', value: '10K+', icon: Activity },
            { label: 'Prizes Awarded', value: '£2.5M+', icon: Trophy },
            { label: 'Charity Impact', value: '£500K+', icon: Heart },
            { label: 'Verified Winners', value: '1,200+', icon: Medal },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <stat.icon className="h-6 w-6 text-primary mb-3 opacity-80" />
              <div className="text-3xl font-bold font-mono">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
