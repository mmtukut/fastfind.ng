import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-lg font-semibold leading-8 tracking-tight text-primary">
            Contact Us
          </p>
          <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let's Build Together
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Whether you're a government entity, a financial institution, or a developer, we're ready to discuss how our infrastructure can power your success.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-xl sm:mt-20">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
              <Input type="text" name="name" id="name" autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
              <Input type="email" name="email" id="email" autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="organization" className="text-foreground/80">Organization</Label>
              <Input type="text" name="organization" id="organization" autoComplete="organization" />
            </div>
            <div>
              <Label htmlFor="message" className="text-foreground/80">Message</Label>
              <Textarea name="message" id="message" rows={4} />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
