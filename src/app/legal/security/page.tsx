import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ShieldCheck, Database, Lock, Server } from 'lucide-react';

const securityMeasures = [
  {
    title: 'Data Encryption',
    description: 'All data, both in transit and at rest, is encrypted using industry-standard protocols like TLS 1.3 and AES-256. This ensures that your information is protected from unauthorized access at all times.',
    icon: Lock,
  },
  {
    title: 'Secure Infrastructure',
    description: 'Our services are hosted on Google Cloud Platform (GCP), benefiting from Google\'s world-class security infrastructure and best practices. Our infrastructure is designed for high availability and resilience.',
    icon: Server,
  },
  {
    title: 'Access Control',
    description: 'We enforce strict access control policies internally. Access to sensitive data is limited to authorized personnel on a need-to-know basis and is logged and audited regularly.',
    icon: ShieldCheck,
  },
  {
    title: 'Data Integrity',
    description: 'We employ robust data validation and verification mechanisms to ensure the integrity and accuracy of our property intelligence data. Our systems are designed to prevent unauthorized modification of data.',
    icon: Database,
  }
];

export default function DataSecurityPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-lg font-semibold leading-8 tracking-tight text-primary">
            Data Security
          </p>
          <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Enterprise-Grade Security for Your Peace of Mind
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            At FastFind360, we understand that data security is paramount. We have built our infrastructure from the ground up with security as a core principle to protect your data and our systems.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-2 lg:mt-24">
          {securityMeasures.map((measure) => {
            const Icon = measure.icon;
            return (
              <div key={measure.title} className="flex flex-col rounded-2xl border border-border/50 bg-secondary/50 p-8 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold leading-7 text-foreground">
                    {measure.title}
                  </h3>
                </div>
                <p className="mt-5 flex-auto text-base leading-7 text-muted-foreground">
                  {measure.description}
                </p>
              </div>
            );
          })}
        </div>
         <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Reporting a Vulnerability</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              If you believe you have found a security vulnerability in our service, please let us know. We take all reports seriously and will investigate them promptly.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">Please email <a href="mailto:security@fastfind360.com" className="text-primary hover:underline">security@fastfind360.com</a> with the details.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
