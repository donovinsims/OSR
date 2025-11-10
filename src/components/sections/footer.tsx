import Link from 'next/link';
import { Bot } from 'lucide-react';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Apps', href: '/agents' },
      { label: 'Categories', href: '/categories' },
      { label: 'Submit App', href: '/submit' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-3 inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">AgentHub</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover 100% free iOS & Mac apps — no subscriptions, no hidden costs.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AgentHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;