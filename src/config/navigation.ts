import {
  BarChart3,
  Gift,
  Heart,
  Home,
  LayoutDashboard,
  ListChecks,
  Medal,
  Settings,
  Shield,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';

export const marketingNav = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Charities', href: '/charities' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
] as const;

export const dashboardNav = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Scores', href: '/dashboard/scores', icon: ListChecks },
  { label: 'Charities', href: '/dashboard/charities', icon: Heart },
  { label: 'Draws', href: '/dashboard/draws', icon: Trophy },
  { label: 'Winnings', href: '/dashboard/winnings', icon: Wallet },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

export const adminNav = [
  { label: 'Analytics', href: '/admin', icon: BarChart3 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Draws', href: '/admin/draws', icon: Trophy },
  { label: 'Charities', href: '/admin/charities', icon: Heart },
  { label: 'Winners', href: '/admin/winners', icon: Medal },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: Wallet },
] as const;
