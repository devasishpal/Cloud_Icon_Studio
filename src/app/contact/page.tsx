import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, Bug, Lightbulb, Heart, Clock, Send, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Contact — App Icon Generator Support',
  description: 'Contact the CloudIcon Studio team. Report bugs, request features, or give feedback about our free app icon generator for Android, iOS, Web & Desktop.',
  keywords: ['CloudIcon Studio contact', 'app icon generator support', 'icon generator help', 'feedback', 'icon tool support', 'bug report icon generator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.typely.in/contact' },
  openGraph: {
    title: 'Contact CloudIcon Studio — App Icon Generator Support',
    description: 'Need help with our free app icon generator? Contact us directly for bug reports, feature requests, and feedback.',
    url: 'https://cloudicon.typely.in/contact',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio support and contact page' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact CloudIcon Studio',
    description: 'Get in touch with CloudIcon Studio about our free app icon generator.',
    images: ['/og-image.png'],
  },
};

const contactOptions = [
  {
    icon: Bug,
    title: 'Report a Bug',
    description: 'Found something broken? Let us know and we will fix it. Screenshots and browser details help us debug faster.',
    email: 'support@typely.in',
  },
  {
    icon: Lightbulb,
    title: 'Feature Request',
    description: 'Have an idea that would make CloudIcon Studio better? We are always listening and love hearing from users.',
    email: 'support@typely.in',
  },
  {
    icon: Heart,
    title: 'General Feedback',
    description: 'Something made your day better? Something confused you? We want to hear it all — the good and the bad.',
    email: 'support@typely.in',
  },
  {
    icon: MessageSquare,
    title: 'Press & Partnerships',
    description: 'Writing a story, exploring a partnership, or interested in embedding our technology? Let us talk.',
    email: 'support@typely.in',
  },
];

export default function ContactPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Mail className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Get in Touch</h1>
          <p className="text-sm text-muted-foreground">We would love to hear from you</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
            <MessageSquare className="size-5 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">We Are Here to Help</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you found a bug, have a feature idea, need help with a specific use case, or just want to say hello — every message reaches a real person. We do not use support tickets, chatbots, or automated responses. Each email is read and answered personally by a member of our small team.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>We typically respond within 24 hours, often sooner.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {contactOptions.map((option) => (
          <div key={option.title} className="rounded-xl border border-border bg-card p-6 flex flex-col">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5 mb-4">
              <option.icon className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold mb-2">{option.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{option.description}</p>
            <a
              href={`mailto:${option.email}`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline mt-auto"
            >
              {option.email}
              <Send className="size-3.5" />
            </a>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
            <Heart className="size-5 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Prefer a Direct Message?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can also reach us directly at{' '}
              <a href="mailto:support@typely.in" className="text-primary font-medium hover:underline">
                support@typely.in
              </a>
              . No forms, no tickets, no automated triage — just a real conversation with someone who cares about the tool and your experience. Whether you are an indie developer, a designer at a large company, or someone who just discovered icon generation — we look forward to hearing from you.
            </p>
          </div>
        </div>
      </div>
    </main>
    </PageLayout>
  );
}
