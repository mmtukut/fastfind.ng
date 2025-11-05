import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { DollarSign, Landmark, Building, Briefcase } from 'lucide-react';

const solutions = [
  {
    title: 'For Government',
    description: 'Enhance revenue assurance, enforce compliance, and drive urban planning with unparalleled property intelligence. Identify unregistered properties and monitor development in real-time.',
    icon: Landmark,
  },
  {
    title: 'For Financial Services',
    description: 'Mitigate risk in mortgage lending and insurance underwriting with verifiable, accurate property data. Accelerate due diligence and reduce fraud with our tamper-proof records.',
    icon: DollarSign,
  },
  {
    title: 'For Real Estate',
    description: 'Provide clients with the most trusted property data on the market. Gain a competitive edge with access to verified property histories, valuation data, and compliance records.',
    icon: Building,
  },
  {
    title: 'API & Intelligence',
    description: 'Integrate Africa\'s most comprehensive property dataset into your applications. Power your fintech, proptech, or analytics platform with our robust, real-time API.',
    icon: Briefcase,
  },
];

export default function SolutionsPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-lg font-semibold leading-8 tracking-tight text-primary">
            Solutions
          </p>
          <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Powering Every Sector of the Property Ecosystem
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our infrastructure is purpose-built to serve the unique needs of governments, financial institutions, and the real estate industry, creating a unified, trustworthy market.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-2 lg:mt-24">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <div key={solution.title} className="flex flex-col rounded-2xl border border-border/50 bg-secondary/50 p-8 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold leading-7 text-foreground">
                    {solution.title}
                  </h3>
                </div>
                <p className="mt-5 flex-auto text-base leading-7 text-muted-foreground">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
