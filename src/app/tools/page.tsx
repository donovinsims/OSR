import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { Wrench, Star, ExternalLink } from 'lucide-react';

export default function ToolsPage() {
  const tools = [
    {
      name: "SwiftUI Preview Pro",
      description: "Advanced live previews and component catalog for SwiftUI",
      category: "iOS Development",
      rating: 4.9,
      users: "12K+",
      featured: true
    },
    {
      name: "App Store Optimizer",
      description: "ASO keyword research and metadata testing for App Store & Mac App Store",
      category: "Marketing",
      rating: 4.7,
      users: "8.5K+",
      featured: true
    },
    {
      name: "Crashlytics Monitor",
      description: "Real-time crash tracking and stability analytics for your apps",
      category: "Analytics",
      rating: 4.8,
      users: "6.2K+",
      featured: false
    },
    {
      name: "TestFlight Orchestrator",
      description: "Manage beta builds, testers, and rollout notes effortlessly",
      category: "Release",
      rating: 4.6,
      users: "4.8K+",
      featured: false
    },
    {
      name: "Xcode Build Matrix",
      description: "Parallel CI for iOS & macOS with code signing made simple",
      category: "CI/CD",
      rating: 4.5,
      users: "5.1K+",
      featured: false
    },
    {
      name: "Icon & Screenshots Kit",
      description: "Generate app icons and localized screenshots for iOS, iPadOS, and macOS",
      category: "Design",
      rating: 4.7,
      users: "7.3K+",
      featured: true
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">
            Essential iOS & Mac Apps
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover curated apps to design, build, test, and ship on iPhone, iPad, and Mac.
          </p>
        </div>

        {/* Featured Tools */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-semibold text-foreground">Featured Apps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.filter(tool => tool.featured).map((tool, index) => (
              <div
                key={index}
                className="group rounded-xl border-2 border-yellow-200 bg-card p-6 transition-all hover:shadow-lg hover:border-yellow-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{tool.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">⭐ {tool.rating}</span>
                    <span className="text-sm text-muted-foreground">{tool.users}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Tools */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">All Apps</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.filter(tool => !tool.featured).map((tool, index) => (
              <div
                key={index}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{tool.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">⭐ {tool.rating}</span>
                    <span className="text-sm text-muted-foreground">{tool.users}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-accent p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Have an app to share?
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Submit your app to help the iOS & Mac community grow.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}