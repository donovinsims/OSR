'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { Bookmark, Loader2, ExternalLink, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/types/api';
import type { Category, App } from '@/types/app';

// Replace local Agent interface with centralized App-based type + legacy fields
// to ensure consistency with shared domain types while supporting current API shape.
type Agent = Partial<App> & {
  id: number;
  slug?: string;
  imageUrl?: string;
  categoryId?: number;
  upvotesCount?: number;
  averageRating?: number;
  category: Pick<Category, 'id' | 'name' | 'slug'> | null;
};

interface Bookmark {
  id: number;
  userId: string;
  agentId: number;
  createdAt: string;
  agent: Agent;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookmarks();
      fetchAgents();
    }
  }, [session]);

  useEffect(() => {
    filterAgents();
  }, [searchQuery, categoryFilter, allAgents]);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      } else {
        toast.error('Failed to load bookmarks');
      }
    } catch (error) {
      toast.error('Error loading bookmarks');
    } finally {
      setIsLoadingBookmarks(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents?pageSize=50');
      if (res.ok) {
        const payload = await res.json() as ApiResponse<Agent[]> | { data?: Agent[]; items?: Agent[]; agents?: Agent[] };
        setAllAgents(payload.data ?? payload.items ?? payload.agents ?? []);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const filterAgents = () => {
    let filtered = [...allAgents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(agent =>
        (agent.name?.toLowerCase().includes(query)) ||
        (agent.description?.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(agent => agent.category?.slug === categoryFilter);
    }

    setFilteredAgents(filtered);
  };

  const handleRemoveBookmark = async (bookmarkId: number) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch(`/api/bookmarks?id=${bookmarkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        toast.success('Bookmark removed');
      } else {
        toast.error('Failed to remove bookmark');
      }
    } catch (error) {
      toast.error('Error removing bookmark');
    }
  };

  const handleAddBookmark = async (agentId: number) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ agentId })
      });

      if (res.ok) {
        toast.success('Bookmark added');
        await fetchBookmarks();
      } else {
        const error = await res.json();
        if (error.code === 'DUPLICATE_BOOKMARK') {
          toast.error('Already bookmarked');
        } else {
          toast.error('Failed to add bookmark');
        }
      }
    } catch (error) {
      toast.error('Error adding bookmark');
    }
  };

  const isBookmarked = (agentId: number) => {
    return bookmarks.some(b => b.agentId === agentId);
  };

  const categories = Array.from(new Set(allAgents.map(a => a.category).filter(Boolean)));

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your bookmarked tools and discover new ones
          </p>
        </div>

        {/* Bookmarked Tools Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">My Bookmarks</h2>
            <span className="text-sm text-muted-foreground">({bookmarks.length})</span>
          </div>

          {isLoadingBookmarks ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-muted/50 rounded-2xl p-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-2">No bookmarks yet</p>
              <p className="text-sm text-muted-foreground">
                Browse tools below and click the bookmark icon to save your favorites
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
                >
                  {bookmark.agent.imageUrl && (
                    <img
                      src={bookmark.agent.imageUrl}
                      alt={bookmark.agent.name || 'App'}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold flex-1">{bookmark.agent.name}</h3>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {bookmark.agent.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {bookmark.agent.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {bookmark.agent.category && (
                      <span className="text-xs px-3 py-1 bg-muted rounded-full">
                        {bookmark.agent.category.name}
                      </span>
                    )}
                    
                    {bookmark.agent.websiteUrl && (
                      <a
                        href={bookmark.agent.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Browse All Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Browse Tools</h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-14 px-4 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat!.id} value={(cat as any)!.slug}>
                  {cat!.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tools Grid */}
          {isLoadingAgents ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => {
                const bookmarked = isBookmarked(agent.id);
                
                return (
                  <div
                    key={agent.id}
                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
                  >
                    {agent.imageUrl && (
                      <img
                        src={agent.imageUrl}
                        alt={agent.name || 'App'}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold flex-1">{agent.name}</h3>
                      <button
                        onClick={() => bookmarked ? null : handleAddBookmark(agent.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          bookmarked
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        title={bookmarked ? 'Bookmarked' : 'Add bookmark'}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {agent.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {agent.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {agent.category && (
                        <span className="text-xs px-3 py-1 bg-muted rounded-full">
                          {agent.category.name}
                        </span>
                      )}
                      
                      {agent.websiteUrl && (
                        <a
                          href={agent.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoadingAgents && filteredAgents.length === 0 && (
            <div className="bg-muted/50 rounded-2xl p-12 text-center">
              <p className="text-lg text-muted-foreground">No tools found</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}