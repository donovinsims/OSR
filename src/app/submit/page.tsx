'use client';

import { useState } from 'react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { Bot, Link as LinkIcon, Tag, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    agentName: '',
    url: '',
    category: '',
    description: '',
    email: ''
  });

  // Category name to ID mapping
  const categoryMap: Record<string, number> = {
    'customer-support': 1,
    'coding': 2,
    'content': 3,
    'data': 4,
    'sales': 5,
    'productivity': 6,
    'design': 7,
    'security': 8,
    'research': 9,
    'other': 10
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert category string to categoryId
      const categoryId = categoryMap[formData.category];
      if (!categoryId) {
        toast.error('Invalid category selected');
        setIsSubmitting(false);
        return;
      }

      // Submit to submissions API with proper payload structure
      const token = localStorage.getItem('bearer_token');
      const submissionRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          payload: {
            name: formData.agentName,
            websiteUrl: formData.url,
            categoryId: categoryId,
            description: formData.description,
            email: formData.email
          }
        })
      });

      if (!submissionRes.ok) {
        const error = await submissionRes.json();
        toast.error(error.error || 'Failed to submit app');
        setIsSubmitting(false);
        return;
      }

      // Subscribe to ConvertKit (App Submission Form)
      try {
        await fetch('/api/convertkit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            formId: '8661759' // App Submission Form ID
          })
        });
      } catch (convertkitError) {
        // Don't block submission if ConvertKit fails
        console.error('ConvertKit subscription failed:', convertkitError);
      }

      toast.success('App submitted successfully! We\'ll review it within 48 hours.');
      
      // Reset form
      setFormData({
        agentName: '',
        url: '',
        category: '',
        description: '',
        email: ''
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-foreground">
            Submit Your App
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Share your iOS or macOS app with the community. Help others discover great tools and workflows.
          </p>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8">
            {/* Agent Name */}
            <div className="mb-6">
              <label htmlFor="agentName" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Bot className="h-4 w-4" />
                App Name
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                placeholder="e.g., Focus Timer for Mac"
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background disabled:opacity-50"
              />
            </div>

            {/* URL */}
            <div className="mb-6">
              <label htmlFor="url" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <LinkIcon className="h-4 w-4" />
                App Website
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://your-app.com"
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background disabled:opacity-50"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Tag className="h-4 w-4" />
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background disabled:opacity-50"
              >
                <option value="">Select a category</option>
                <option value="customer-support">Customer Support</option>
                <option value="coding">Coding & Development</option>
                <option value="content">Content Creation</option>
                <option value="data">Data Analysis</option>
                <option value="sales">Sales & Marketing</option>
                <option value="productivity">Productivity</option>
                <option value="design">Design & Creative</option>
                <option value="security">Security</option>
                <option value="research">Research</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your app and what it does..."
                required
                disabled={isSubmitting}
                rows={4}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background resize-none disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="mb-8">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background disabled:opacity-50"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                We'll use this to contact you about your submission
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit App'
              )}
            </button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              By submitting, you agree that your app meets our quality guidelines
            </p>
          </form>

          {/* Info Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 font-semibold text-foreground">Quick Review</h3>
              <p className="text-sm text-muted-foreground">
                We review all submissions within 48 hours and will contact you via email.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 font-semibold text-foreground">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                We curate only the best apps to ensure quality for our community.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}