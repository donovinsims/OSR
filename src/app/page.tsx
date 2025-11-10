import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero-section';
import FilterBar from '@/components/sections/filter-bar';
import ResourceGrid from '@/components/sections/resource-grid';
import CtaSection from '@/components/sections/cta-section';
import Footer from '@/components/sections/footer';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        
        <section className="bg-background">
          <div className="container mx-auto px-6 pt-12 md:pt-16">
            <FilterBar />
          </div>
          <Suspense fallback={
            <div className="container mx-auto px-6 py-12">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading apps...</p>
                </div>
              </div>
            </div>
          }>
            <ResourceGrid />
          </Suspense>
        </section>
        
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}