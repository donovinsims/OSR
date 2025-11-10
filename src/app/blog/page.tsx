import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: "Getting Started with OpenAI Agents: A Complete Guide",
      excerpt: "Learn everything you need to know about building and deploying OpenAI agents for your business.",
      date: "March 15, 2024",
      readTime: "8 min read",
      category: "Tutorial",
      featured: true
    },
    {
      title: "10 Best Practices for Training AI Agents",
      excerpt: "Discover the essential practices that will help you create more effective and reliable AI agents.",
      date: "March 12, 2024",
      readTime: "6 min read",
      category: "Best Practices",
      featured: true
    },
    {
      title: "How AI Agents are Transforming Customer Service",
      excerpt: "Explore real-world examples of companies using AI agents to revolutionize their customer support.",
      date: "March 10, 2024",
      readTime: "5 min read",
      category: "Case Study",
      featured: false
    },
    {
      title: "The Future of AI Agents in 2024",
      excerpt: "What's next for AI agents? We explore the trends and predictions shaping the industry.",
      date: "March 8, 2024",
      readTime: "7 min read",
      category: "Industry Insights",
      featured: false
    },
    {
      title: "Building Multi-Agent Systems: A Practical Approach",
      excerpt: "Step-by-step guide to creating systems where multiple AI agents work together seamlessly.",
      date: "March 5, 2024",
      readTime: "10 min read",
      category: "Tutorial",
      featured: false
    },
    {
      title: "Security Best Practices for AI Agents",
      excerpt: "Protect your AI agents and ensure they operate safely and securely in production environments.",
      date: "March 1, 2024",
      readTime: "6 min read",
      category: "Security",
      featured: false
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">
            AgentHub Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Insights, tutorials, and news about iOS & Mac apps and the ecosystem around them.
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Featured Articles</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {posts.filter(post => post.featured).map((post, index) => (
              <article
                key={index}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">Featured</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Recent Articles</h2>
          <div className="space-y-6">
            {posts.filter(post => !post.featured).map((post, index) => (
              <article
                key={index}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:mt-4" />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-accent p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Stay Updated
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Get the latest articles and insights delivered to your inbox.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}