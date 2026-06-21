import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      {/* Left side - Auth Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative z-10">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>

      {/* Right side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex relative bg-zinc-900 items-center justify-center overflow-hidden">
        {/* Abstract shapes / gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-30" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-20 text-center text-white px-12 max-w-lg">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold mb-8 hover:text-primary transition-colors">
            <Trophy className="h-8 w-8 text-primary" />
            <span>GreenSwing</span>
          </Link>
          <h2 className="text-3xl font-bold mb-4 font-sans tracking-tight">
            Elevate your game. Impact the world.
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Join the premium community of golfers tracking their performance, winning monthly prizes, and supporting charities that matter.
          </p>
        </div>
      </div>
    </div>
  );
}
