import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { Bot, Zap, TrendingUp, Users } from 'lucide-react';

export default function AgentsPage() {
  const featuredAgents = [
    { name: "Customer Support AI", category: "Customer Service", rating: 4.8, users: "2.5K" },
    { name: "Code Assistant Pro", category: "Development", rating: 4.9, users: "5.2K" },
    { name: "Content Writer AI", category: "Content Creation", rating: 4.7, users: "3.8K" },
    { name: "Data Analyzer", category: "Analytics", rating: 4.6, users: "1.9K" },
    { name: "Sales Assistant", category: "Sales & Marketing", rating: 4.8, users: "4.1K" },
    { name: "Project Manager AI", category: "Productivity", rating: 4.5, users: "2.3K" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">
            Discover iOS & Mac Apps
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse our curated collection of iOS and macOS apps. Find the perfect app for your workflow.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Bot className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="text-2xl font-bold text-foreground">200+</div>
            <div className="text-sm text-muted-foreground">Apps</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Zap className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="text-2xl font-bold text-foreground">15</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="text-2xl font-bold text-foreground">50K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="text-2xl font-bold text-foreground">Daily</div>
            <div className="text-sm text-muted-foreground">New Additions</div>
          </div>
        </div>

        {/* Featured Agents */}
        <div className="mb-8">
          <h2 className="mb-6 text-3xl font-semibold text-foreground">Featured Apps</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredAgents.map((agent, index) => (
              <div
                key={index}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{agent.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{agent.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">⭐ {agent.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{agent.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-accent p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            More apps coming soon
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            We're adding new apps daily. Check back soon for more options.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}