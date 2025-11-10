"use client";

import Link from 'next/link';
import { Bot, Menu, X, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navLinksData = [
  { href: "/agents", label: "Apps", className: "" },
  { href: "/categories", label: "Categories", className: "" },
  { href: "/tools", label: "Tools", className: "hidden lg:inline-flex" },
  { href: "/blog", label: "Blog", className: "hidden sm:inline-flex" }
];

const Logo = () =>
  <Link href="/" className="flex items-center gap-2" aria-label="home">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
      <Bot className="h-5 w-5 text-primary-foreground" />
    </div>
    <span className="hidden font-bold text-foreground sm:inline-block">
      AgentHub
    </span>
  </Link>;

const NavLink = ({ href, label, className }: typeof navLinksData[0]) =>
  <Link
    href={href}
    className={`inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${className}`}>
    {label}
  </Link>;

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status when session loads
  useState(() => {
    if (session?.user?.email) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    }
  });

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-[72px] grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="justify-self-start">
          <Logo />
        </div>

        <nav className="hidden justify-self-center md:flex">
          <div className="flex items-center gap-x-8">
            {navLinksData.map((link) =>
              <NavLink key={link.href} {...link} />
            )}
            {!isPending && session?.user && (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center h-10 w-10 text-foreground hover:bg-muted rounded-lg transition-colors justify-self-end"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden md:flex items-center gap-2 md:gap-3 justify-self-end">
          {!isPending && session?.user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground hidden lg:inline">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border px-3 sm:px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-border px-3 sm:px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-primary px-3 sm:px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-6 flex flex-col gap-1">
            {navLinksData.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center text-base font-medium text-foreground transition-colors hover:text-muted-foreground px-3 py-3 rounded-lg hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

            {!isPending && session?.user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-muted-foreground px-3 py-3 rounded-lg hover:bg-muted"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-muted-foreground px-3 py-3 rounded-lg hover:bg-muted"
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </Link>
                )}
              </>
            )}

            <div className="flex flex-col gap-2 pt-6 mt-2 border-t border-border">
              {!isPending && session?.user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full h-11"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full h-11">
                      Sign in
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full h-11">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;