'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/convertkit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          formId: '8661754' // Newsletter/CTA Form ID
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background px-6 py-24 md:py-32 lg:py-40">
      <div className="container mx-auto">
        <div className="mx-auto rounded-3xl border border-border bg-card p-12 shadow-xl md:p-16 lg:p-24 !shadow-none !w-full !h-full !max-w-full">
          <div className="text-center">
            {/* Heading */}
            <h2 className="mb-6 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              Stay Updated with the Latest
              <br />
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">Free iOS & Mac Apps</span>
            </h2>

            {/* Subheading */}
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Get weekly updates on new free apps, tools, and resources delivered straight to your inbox — 100% free, always
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Mail className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Weekly free app updates</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Exclusive content</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>

            {/* Social Proof */}
            <p className="mt-8 text-xs text-muted-foreground">
              Join <span className="font-semibold text-foreground">5,000+</span> iOS & Mac app enthusiasts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}