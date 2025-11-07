import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { Navbar } from '@/components/layout/Navbar';

export default function LandingPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <Hero />
      <Stats />
    </div>
  );
}
