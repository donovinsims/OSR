import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { 
  Headphones, 
  Code, 
  FileText, 
  BarChart, 
  ShoppingCart, 
  Briefcase,
  Palette,
  Shield,
  Lightbulb,
  Globe,
  Heart,
  Cpu
} from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    { 
      name: "Customer Support", 
      count: 28, 
      icon: Headphones,
      color: "from-blue-500 to-cyan-500",
      description: "Apps that help with customer service and support"
    },
    { 
      name: "Coding & Development", 
      count: 42, 
      icon: Code,
      color: "from-purple-500 to-pink-500",
      description: "Apps specialized in software development and coding"
    },
    { 
      name: "Content Creation", 
      count: 35, 
      icon: FileText,
      color: "from-orange-500 to-red-500",
      description: "Create engaging content with powerful tools"
    },
    { 
      name: "Data Analysis", 
      count: 24, 
      icon: BarChart,
      color: "from-green-500 to-emerald-500",
      description: "Analyze and visualize data with powerful analytics"
    },
    { 
      name: "Sales & Marketing", 
      count: 31, 
      icon: ShoppingCart,
      color: "from-yellow-500 to-amber-500",
      description: "Boost your sales and marketing efforts"
    },
    { 
      name: "Productivity", 
      count: 40, 
      icon: Briefcase,
      color: "from-indigo-500 to-blue-500",
      description: "Streamline workflows and boost efficiency"
    },
    { 
      name: "Design & Creative", 
      count: 18, 
      icon: Palette,
      color: "from-pink-500 to-rose-500",
      description: "Design and creative apps"
    },
    { 
      name: "Security", 
      count: 15, 
      icon: Shield,
      color: "from-slate-500 to-zinc-500",
      description: "Protect and secure your systems"
    },
    { 
      name: "Research", 
      count: 22, 
      icon: Lightbulb,
      color: "from-violet-500 to-purple-500",
      description: "Research assistance and information gathering"
    },
    { 
      name: "Translation", 
      count: 12, 
      icon: Globe,
      color: "from-teal-500 to-cyan-500",
      description: "Break language barriers with translation"
    },
    { 
      name: "Healthcare", 
      count: 16, 
      icon: Heart,
      color: "from-red-500 to-pink-500",
      description: "Healthcare and wellness apps"
    },
    { 
      name: "Automation", 
      count: 38, 
      icon: Cpu,
      color: "from-gray-500 to-slate-500",
      description: "Automate repetitive tasks and workflows"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">
            Browse by Category
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore iOS & Mac apps organized by use case and category. Find exactly what you need.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color}`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {category.count} apps
                  </span>
                  <span className="text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View all →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-accent p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Can't find what you're looking for?
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            We're constantly adding new categories and apps. Let us know what you need.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}