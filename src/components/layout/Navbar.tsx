
'use client';

import Link from 'next/link';
import { Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Satellite className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">FastFind360</span>
          </Link>
        </div>

        <nav className="items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link
              href="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Dashboard
            </Link>
             <Link
              href="/#features"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Features
            </Link>
             <Link
              href="/#pricing"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Pricing
            </Link>
             <Link
              href="/#contact"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Contact
            </Link>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild variant="ghost">
            <Link href="/dashboard">Sign In</Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href="/dashboard">Launch App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
