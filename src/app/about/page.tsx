import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Globe, Lock, Download, Zap, Heart, Code, Palette } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'About CloudIcon Studio — Free App Icon Generator',
  description: 'Learn about CloudIcon Studio — the 100% client-side free app icon generator for Android, iOS, Web & Desktop. No uploads, no servers, no accounts. Privacy-first icon design tool.',
  keywords: ['CloudIcon Studio about', 'free app icon generator', 'client-side icon tool', 'privacy-first design tool', 'icon maker app', 'online icon creator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.typely.in/about' },
  openGraph: {
    title: 'About CloudIcon Studio — Free App Icon Generator',
    description: 'Learn about CloudIcon Studio — the 100% client-side free app icon generator. No uploads, no servers, instant export for Android, iOS, Web & Desktop.',
    url: 'https://cloudicon.typely.in/about',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio free app icon generator about page' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About CloudIcon Studio — Free App Icon Generator',
    description: 'The 100% client-side free app icon generator. No uploads, no servers, no accounts.',
    images: ['/og-image.png'],
  },
};

const stats = [
  { icon: Download, label: 'Platforms Supported', value: '4' },
  { icon: Globe, label: 'Runs Completely', value: 'Client-Side' },
  { icon: Lock, label: 'Zero Uploads', value: '100%' },
  { icon: Zap, label: 'Export Speed', value: 'Instant' },
];

const values = [
  {
    icon: Lock,
    title: 'Privacy by Architecture',
    content: 'We do not just promise privacy — we built it into the foundation. Every image you upload stays in your browser. No servers, no uploads, no data collection. Your creative work belongs to you, period.',
  },
  {
    icon: Zap,
    title: 'Fast by Design',
    content: 'GPU-accelerated canvas rendering powered by Fabric.js means your icons generate instantly. No waiting for servers, no queue times, no processing delays. Upload, tweak, export — done in under a minute.',
  },
  {
    icon: Palette,
    title: 'Beautiful on Every Platform',
    content: 'Android, iOS, Web, Desktop — each platform has unique icon requirements. CloudIcon Studio generates production-ready icons for all of them from a single upload, with the right sizes, shapes, and formats.',
  },
  {
    icon: Heart,
    title: 'Free for Everyone',
    content: 'No paid tiers, no premium features, no hidden limits. CloudIcon Studio is completely free for personal and commercial use. We built this because we needed it ourselves, and we believe great tools should be accessible to everyone.',
  },
  {
    icon: Code,
    title: 'Built with Modern Tech',
    content: 'Powered by Next.js 16, Fabric.js, and the Canvas API. The entire application is a PWA with offline support, keyboard shortcuts, undo/redo, and real-time previews. It is a design tool that feels like a native app.',
  },
  {
    icon: Globe,
    title: 'Offline Ready',
    content: 'Install CloudIcon Studio as a Progressive Web App and keep working without an internet connection. Every feature — upload, edit, preview, export — works offline. Your internet could go down and you would not even notice.',
  },
];

export default function AboutPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About CloudIcon Studio</h1>
          <p className="text-sm text-muted-foreground">The story behind the tool</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          CloudIcon Studio was born from a simple frustration: generating app icons should not require a design degree, a server upload, or a paid subscription. Every existing tool either uploaded your images to unknown servers, produced incorrectly sized icons, or bombarded you with upsells for basic features. So we built our own.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The idea was straightforward — create a tool that runs entirely in your browser, generates production-ready icons for every major platform from a single upload, and respects your privacy by never sending your images anywhere. No accounts, no servers, no data collection. Just a clean, fast, capable icon generator that works offline.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          What started as an internal tool for our own app development workflow quickly became something we wanted to share. We polished the interface, added real-time previews with device mockups, expanded platform support, and released it for free. Today, CloudIcon Studio is used by indie developers, design agencies, and large teams alike — all without a single image ever leaving their browser.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 sm:p-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
                <stat.icon className="size-5 text-primary" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {values.map((value) => (
          <div key={value.title} className="rounded-xl border border-border bg-card p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5 mb-4">
              <value.icon className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold mb-2">{value.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{value.content}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <h2 className="font-semibold mb-2">Ready to generate your icons?</h2>
        <p className="text-sm text-muted-foreground mb-4">It takes less than a minute, and your images never leave your device.</p>
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)' }}
        >
          Launch the Editor
          <Zap className="size-4" />
        </Link>
      </div>
    </main>
    </PageLayout>
  );
}
