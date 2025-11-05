import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Stats } from '@/components/landing/Stats';
import { Cta } from '@/components/landing/Cta';
import { Footer } from '@/components/landing/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function LandingPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Cta />
      <Footer />
    </div>
  );
}
