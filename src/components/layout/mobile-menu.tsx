'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { marketingNav } from '@/config/navigation';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isLoading } = useUser();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-80 flex flex-col">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <div className="flex items-center space-x-2 mb-8 mt-4">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">GreenSwing</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="my-4 border-t" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
          
          {!isLoading && (
            <div className="flex flex-col gap-3 mt-auto">
              {user ? (
                <Button asChild className="w-full rounded-full" onClick={onClose}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full rounded-full" onClick={onClose}>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full rounded-full" onClick={onClose}>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
