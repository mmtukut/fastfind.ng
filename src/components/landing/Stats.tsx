'use client';

import Image from "next/image";

const stats = [
  { name: 'Trust Deficit in Nigeria\'s Property Market', value: '₦500 Billion' },
  { name: 'Properties Analyzed via Satellite', value: '1.2 Million+' },
  { name: 'AI Classification Accuracy', value: '99.8%' },
  { name: 'Potential Revenue Uplift for Governments', value: '+185%' },
];

export function Stats() {
  return (
    <section className="relative bg-secondary/30 py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-muted-foreground">
                  {stat.name}
                </dt>
                <dd className="order-first font-headline text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center flex justify-center items-center gap-4">
            <p className="font-semibold text-muted-foreground">With support from</p>
            <a href="https://nigcomsat.gov.ng/" target="_blank" rel="noopener noreferrer">
              <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/nigcomsat.jpeg?alt=media&token=82b9081c-455f-412c-903f-fc53b13fb4bd"
                  alt="NIGCOMSAT Logo"
                  width={150}
                  height={36}
                  className="object-contain"
                  data-ai-hint="logo company"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
