import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

const openPositions = [
  {
    title: 'Senior Backend Engineer (AI/ML)',
    location: 'Lagos, Nigeria (Remote-first)',
    department: 'Engineering',
  },
  {
    title: 'Geospatial Data Scientist',
    location: 'Abuja, Nigeria',
    department: 'Data Science',
  },
  {
    title: 'Government Partnerships Lead',
    location: 'Lagos, Nigeria',
    department: 'Business Development',
  },
  {
    title: 'Product Manager, APIs',
    location: 'Remote',
    department: 'Product',
  },
];

export default function CareersPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-lg font-semibold leading-8 tracking-tight text-primary">
            Careers
          </p>
          <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Join Us in Building the Foundational Layer
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We're looking for ambitious, mission-driven individuals to help us solve one of the continent's most complex challenges. If you are passionate about technology, transparency, and impact, we want to hear from you.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl sm:mt-20 lg:mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Open Positions</h2>
          <div className="mt-8 space-y-4">
            {openPositions.map((position) => (
              <div key={position.title} className="rounded-2xl border border-border/50 bg-secondary/50 p-6 flex justify-between items-center transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{position.title}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {position.location} &middot; {position.department}
                  </p>
                </div>
                <Button variant="ghost" asChild>
                  <Link href="#">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
           <div className="mt-12 text-center">
             <p className="text-muted-foreground">Don't see a role that fits? We're always looking for talent.</p>
             <Button variant="link" asChild className="mt-2">
                <Link href="mailto:careers@fastfind360.com">
                    Send us your resume
                </Link>
             </Button>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
