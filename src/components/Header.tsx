"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, User, Users, LogIn, LogOut, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data'; // Assuming users data can be fetched here
import { useMemo } from 'react';

export function Header() {
  const pathname = usePathname();
  const { user: authUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const currentUser = useMemo(() => {
    // This is a mock lookup. In a real app, you'd fetch this from your backend/DB
    // after getting the authUser.uid
    return users.find(u => u.id === '1'); // For now, let's assume Alex (id: 1) is our logged-in user
  }, []);

  const isAdmin = currentUser?.isAdmin;


  const handleLogout = async () => {
    await auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Browse', icon: Users, show: 'always' },
    { href: '/swaps', label: 'Swaps', icon: ArrowLeftRight, show: 'always' },
    { href: '/profile', label: 'Profile', icon: User, show: 'always' },
    { href: '/admin', label: 'Admin', icon: Shield, show: 'admin' },
  ];

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-foreground font-headline">
              SkillVerse
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {navLinks.map(({ href, label, icon: Icon, show }) => {
              if (show === 'admin' && (!authUser || !isAdmin)) return null;

              const effectiveHref = (!authUser && (href === '/profile' || href === '/swaps' || href === '/admin')) ? '/login' : href;
              
              return (
                <Button key={href} asChild variant="ghost" className={cn(
                  "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  pathname === href && "bg-primary-foreground/20 text-primary-foreground"
                )}>
                  <Link href={effectiveHref} className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                </Button>
              )
            })}

            {!loading && !authUser && (
              <>
                 <Button asChild variant="ghost" className={cn(
                  "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  pathname === '/signup' && "bg-primary-foreground/20 text-primary-foreground"
                )}>
                  <Link href="/signup" className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" className={cn(
                  "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  pathname === '/login' && "bg-primary-foreground/20 text-primary-foreground"
                )}>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    <span className="hidden sm:inline">Log In</span>
                  </Link>
                </Button>
              </>
            )}

            {!loading && authUser && (
              <Button onClick={handleLogout} variant="ghost" className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                 <div className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </div>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
