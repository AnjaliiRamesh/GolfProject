'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { marketingNav } from '@/config/navigation';
import { Trophy, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { MobileMenu } from './mobile-menu';

export function Header() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold">GreenSwing</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {marketingNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {!isLoading && (
                <>
                  {user ? (
                    <Button asChild variant="default" className="rounded-full">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="ghost">
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button asChild className="rounded-full">
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
            
            <button
              className="md:hidden p-2 text-foreground/60 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
