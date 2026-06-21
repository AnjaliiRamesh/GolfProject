import React from 'react';
import Link from 'next/link';
import { Trophy, LogOut, BarChart3, Users, Gift, Ticket, Crown } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';

const adminNav = [
  { href: '/admin', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/charities', label: 'Charities', icon: Gift },
  { href: '/admin/draws', label: 'Draws', icon: Ticket },
  { href: '/admin/winners', label: 'Winners', icon: Crown },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single();

  // Check if user is admin
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30 fixed inset-y-0 z-10">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">GreenSwing</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin Panel
          </div>
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground text-muted-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground text-muted-foreground"
            >
              <Trophy className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
        
        <div className="p-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <form action={signOut}>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" type="submit">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b flex items-center justify-between px-4 sticky top-0 bg-background/95 backdrop-blur z-20">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-bold">GreenSwing</span>
          </Link>
          <ThemeToggle />
        </header>
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
