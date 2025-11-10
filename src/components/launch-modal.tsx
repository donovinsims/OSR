'use client';

import { useState } from 'react';
import { X, Rocket } from 'lucide-react';

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LaunchModal({ isOpen, onClose }: LaunchModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Close after 2 seconds
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Rocket className="h-8 w-8 text-foreground" />
              </div>
            </div>

            <h2 className="mb-3 text-center text-2xl font-bold text-foreground">
              Coming Soon!
            </h2>
            <p className="mb-6 text-center text-muted-foreground">
              Our iOS & Mac apps directory is launching soon. Be the first to know when we go live and get early access to the best apps.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Notify Me'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Join 1,000+ early subscribers · Unsubscribe anytime
            </p>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground">You're on the list!</h3>
            <p className="mt-2 text-muted-foreground">We'll notify you when we launch.</p>
          </div>
        )}
      </div>
    </div>
  );
}