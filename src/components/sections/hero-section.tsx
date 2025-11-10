'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Sparkles } from 'lucide-react';
import { LaunchModal } from '@/components/launch-modal';

export default function HeroSection() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <section className="bg-background px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">100% Free iOS & Mac Apps</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Discover the Best
            <br />
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Free iOS & Mac Apps
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A curated directory of completely free iOS and macOS apps for designers, developers, and indie makers — no subscriptions, no hidden costs
          </p>

          {/* Search Bar */}
          <div className="mx-auto mb-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search free apps, tools, or categories..."
                  className="w-full h-14 rounded-xl border-2 border-border bg-muted pl-12 pr-5 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 rounded-xl bg-primary text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">200+</span> Free Apps
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">15</span> Categories
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">100%</span> Free Forever
            </div>
          </div>
        </div>
      </section>
      
      <LaunchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}