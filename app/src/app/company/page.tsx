import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import Image from 'next/image';

export default function CompanyPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-headline text-lg font-semibold leading-8 tracking-tight text-primary">
            Our Company
          </p>
          <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Building the Future of African Real Estate
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            FastFind360 was founded on a simple but powerful premise: that trust and transparency are the bedrock of a thriving property market. We are a team of engineers, data scientists, and policy experts dedicated to building the deep-tech infrastructure required to unlock Africa's full real estate potential.
          </p>
        </div>
        <div className="mt-16 sm:mt-24">
            <Image 
                src="https://picsum.photos/seed/1/1200/600"
                alt="Our Team"
                width={1200}
                height={600}
                className="rounded-2xl shadow-2xl shadow-primary/10"
                data-ai-hint="team business"
            />
        </div>
        <div className="mx-auto mt-16 max-w-3xl text-center sm:mt-24">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our mission is to create a single source of truth for property data across Africa. By harnessing satellite technology, AI, and enterprise-grade verification, we are eliminating the systemic inefficiencies and fraud that have held back development. We empower governments to maximize revenue, help financial institutions to minimize risk, and enable developers and individuals to transact with confidence.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
