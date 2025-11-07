import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
});


export const metadata: Metadata = {
  title: 'FastFind360 - Property Intelligence Platform',
  description: 'Africa\'s first satellite-powered property intelligence system for government revenue intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      {/* The default theme is dark, but pages can override it by adding 'light' to the html tag */}
      <body className={cn(inter.variable, spaceGrotesk.variable)}>
        {children}
      </body>
    </html>
  );
}
