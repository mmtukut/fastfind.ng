'use client';

import {
  Database,
  ShieldCheck,
  Building,
  ArrowRight,
  BarChart,
  Target,
} from 'lucide-react';

const features = [
  {
    name: 'AI-Powered Classification',
    description:
      'Leverages satellite imagery and proprietary AI models to classify buildings with 99.8% accuracy, identifying unregistered and non-compliant properties at scale.',
    icon: Target,
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    name: 'Enterprise-Grade Verification',
    description:
      'Provides a verifiable, tamper-proof digital record for every property, integrating seamlessly with government databases and financial systems to eliminate fraud.',
    icon: ShieldCheck,
    bgColor: 'bg-sky-500/10',
    iconColor: 'text-sky-400',
  },
  {
    name: 'Revenue Intelligence API',
    description:
      'Unlocks unprecedented revenue insights for governments and financial institutions with real-time data on property development, value, and compliance status.',
    icon: BarChart,
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-lg font-semibold leading-8 tracking-tight text-primary">
            The Foundational Layer
          </p>
          <h2 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Technology for a Transparent Market
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We are not an app; we are the core infrastructure. Our deep-tech
            stack is purpose-built to solve systemic trust issues in Africa's
            property markets, starting with Nigeria.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-none sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col rounded-2xl border border-border/50 bg-secondary/50 p-8 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}
                  >
                    <feature.icon
                      className={`h-6 w-6 ${feature.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-bold leading-7 text-foreground">
                    {feature.name}
                  </h3>
                </div>
                <p className="mt-5 flex-auto text-base leading-7 text-muted-foreground">
                  {feature.description}
                </p>
                <p className="mt-6">
                  <a
                    href="#"
                    className="group inline-flex items-center text-sm font-semibold leading-6 text-primary"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
