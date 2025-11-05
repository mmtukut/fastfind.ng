'use client';

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
        </div>
      </div>
    </section>
  );
}
