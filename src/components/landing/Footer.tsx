import { Logo } from '../layout/Logo';
import Link from 'next/link';
import Image from 'next/image';

const navigation = {
  solutions: [
    { name: 'For Government', href: '/solutions' },
    { name: 'For Financial Services', href: '/solutions' },
    { name: 'For Real Estate', href: '/solutions' },
    { name: 'API & Intelligence', href: '/solutions' },
  ],
  company: [
    { name: 'About Us', href: '/company' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/company' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Data Security', href: '/legal/security' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-2xl">FastFind360</span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Building the foundational infrastructure for property intelligence in Africa.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                       <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                       <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs leading-5 text-muted-foreground">&copy; {new Date().getFullYear()} FastFind360. All rights reserved.</p>

            <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">Supported By:</p>
                <a href="https://nigcomsat.gov.ng/" target="_blank" rel="noopener noreferrer">
                    <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/nigcomsat.jpeg?alt=media&token=82b9081c-455f-412c-903f-fc53b13fb4bd"
                        alt="NIGCOMSAT Logo"
                        width={100}
                        height={24}
                        className="object-contain"
                    />
                </a>
            </div>
        </div>

      </div>
    </footer>
  )
}
