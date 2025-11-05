'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

export function Cta() {
  return (
    <section className="relative py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 top-60 h-1/2 w-full bg-gradient-to-b from-transparent to-primary/10"
      ></div>
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Unlock Africa's Property Market
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            FastFind360 is building the foundational infrastructure for a transparent and efficient real estate ecosystem. Join us in transforming the landscape.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href="/dashboard">
                Launch App <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:contact@fastfind360.com">
                Contact Sales <Mail className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
