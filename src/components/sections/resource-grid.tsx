'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExternalLink, Star, TrendingUp, Sparkles, Brain, MessageSquare, Code, BarChart3, Loader2, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/types/api';
import type { App } from '@/types/app';

// ... keep existing code ...
// align local Agent shape to central App type while accommodating legacy fields from API

type Agent = Partial<App> & {
  id: number;
  category_id?: number;
  category_name?: string;
  logo_url?: string;
  website_url?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_verified?: boolean;
  rating_avg?: number;
  rating_count?: number;
  upvotes?: number;
  views?: number;
};

const categoryIcons: Record<string, LucideIcon> = {
  'Customer Support': MessageSquare,
  'Coding & Dev': Code,
  'Content Creation': Sparkles,
  'Data Analysis': BarChart3,
  'Productivity': Brain,
  'Sales & Marketing': TrendingUp,
};

const categoryColors: Record<string, string> = {
  'Customer Support': 'from-purple-500 to-pink-500',
  'Coding & Dev': 'from-blue-500 to-cyan-500',
  'Content Creation': 'from-orange-500 to-red-500',
  'Data Analysis': 'from-green-500 to-emerald-500',
  'Productivity': 'from-indigo-500 to-purple-500',
  'Sales & Marketing': 'from-yellow-500 to-orange-500',
};

const AgentCard = ({ agent }: { agent: Agent }) => {
  const IconComponent = categoryIcons[agent.category_name || ''] || Brain;
  const colorClass = categoryColors[agent.category_name || ''] || 'from-gray-500 to-gray-600';
  
  const handleView = async () => {
    // Track visit
    try {
      await fetch('/api/metrics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agent.id })
      });
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
    
    // Open agent website
    if (agent.website_url) {
      window.open(agent.website_url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareUrl = agent.website_url || window.location.origin;
    const shareData = {
      title: agent.name || 'App',
      text: agent.description || '',
      url: shareUrl,
    };
    
    // Track share
    try {
      await fetch('/api/metrics/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agent.id })
      });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
    
    // Try native share
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };
  
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        {agent.is_featured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-900">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        )}
        {agent.is_trending && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-900">
            <TrendingUp className="h-3 w-3" />
            Trending
          </span>
        )}
      </div>

      {/* Icon Header */}
      <div className="p-6 pb-4">
        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} shadow-lg`}>
          <IconComponent className="h-7 w-7 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {agent.name}
          </h3>
          {agent.is_verified && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {agent.description}
        </p>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {agent.category_name}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{agent.rating_avg?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="text-muted-foreground">
              {agent.upvotes ?? 0} upvotes
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              title="Share app"
            >
              <Share2 className="h-3 w-3" />
            </button>
            <button 
              onClick={handleView}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceGrid = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const trending = searchParams.get('trending');
        
        if (search) params.append('search', search);
        if (category && category !== 'all') params.append('category_id', category);
        if (featured) params.append('featured', 'true');
        if (trending) params.append('trending', 'true');
        
        const response = await fetch(`/api/agents?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        
        const payload = await response.json() as ApiResponse<Agent[]> | { data?: Agent[]; agents?: Agent[]; items?: Agent[] };
        setAgents(payload.data ?? payload.agents ?? payload.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [searchParams]);

  if (loading) {
    return (
      <section className="bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading apps...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-4xl">⚠️</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Apps</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={() => router.refresh()}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (agents.length === 0) {
    return (
      <section className="bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Apps Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <button 
                onClick={() => router.push('/')}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Load More - Hidden for now since we have all data */}
        {agents.length >= 20 && (
          <div className="mt-12 text-center">
            <button className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-border bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Load More Apps
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourceGrid;