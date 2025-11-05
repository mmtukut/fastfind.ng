import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Stats } from '@/components/landing/Stats';
import { Cta } from '@/components/landing/Cta';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <Stats />
      <Features />
      <Cta />
      <Footer />
    </div>
  );
}
