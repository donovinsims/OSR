'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category } from '@/types/app';
import { resolveCategoryCount } from '@/types/app';
import type { ApiResponse } from '@/types/api';

function FilterBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const payload = await response.json() as ApiResponse<Category[]> | Category[] | { categories?: Category[] };
          // Accept both legacy array response and new ApiResponse shape
          const items: Category[] = Array.isArray(payload)
            ? payload
            : (payload as ApiResponse<Category[]>).data || (payload as any)?.categories || [];
          setCategories(items);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const updateFilters = (newCategory?: string, newSearch?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    const category = newCategory !== undefined ? newCategory : activeFilter;
    const search = newSearch !== undefined ? newSearch : searchQuery;
    
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveFilter(categoryId);
    updateFilters(categoryId, undefined);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(undefined, searchQuery);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </form>
        
        <button 
          type="button"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Apps
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id.toString())}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === category.id.toString()
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category.name}
            {resolveCategoryCount(category) !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activeFilter === category.id.toString()
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-background text-muted-foreground'
                }`}
              >
                {resolveCategoryCount(category)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const FilterBar = () => {
  return (
    <Suspense fallback={
      <div className="space-y-4 pb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="h-10 w-full rounded-lg border border-input bg-background animate-pulse" />
          </div>
          <div className="h-10 w-24 rounded-lg border border-input bg-background animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <FilterBarContent />
    </Suspense>
  );
};

export default FilterBar;