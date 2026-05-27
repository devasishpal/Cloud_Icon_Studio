import type { Metadata } from 'next';
import Link from 'next/link';
import { History, Sparkles, Rocket, Layers, Palette, Zap, Monitor, Smartphone, Globe, RefreshCw } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Changelog — App Icon Generator Release Notes',
  description: 'Release history and product updates for CloudIcon Studio — the free, client-side app icon generator for Android, iOS, Web & Desktop.',
  keywords: ['CloudIcon Studio changelog', 'release notes', 'app icon generator updates', 'version history', 'product changelog', 'icon tool updates'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.typely.in/changelog' },
  openGraph: {
    title: 'Changelog — App Icon Generator Release Notes',
    description: 'Release history and product updates for CloudIcon Studio — the free app icon generator.',
    url: 'https://cloudicon.typely.in/changelog',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio release notes and changelog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog — CloudIcon Studio',
    description: 'Release history and product updates for the free app icon generator.',
    images: ['/og-image.png'],
  },
};

const releases = [
  {
    version: 'v1.0.0',
    date: 'May 16, 2026',
    icon: Rocket,
    tagline: 'The initial release of CloudIcon Studio — built from the ground up to be the fastest, most privacy-respecting app icon generator on the web.',
    sections: [
      {
        title: 'Core Features',
        items: [
          'Multi-platform icon export supporting Android, iOS, Web (PWA), and Desktop platforms from a single upload',
          'GPU-accelerated canvas rendering powered by Fabric.js for smooth, real-time editing',
          'Real-time previews with accurate device mockups for each platform, updating live as you make adjustments',
          'Comprehensive editing toolset including rotation, background, padding, crop, safe area, and shape controls',
          'Full undo/redo system with keyboard shortcuts for non-destructive experimentation',
          'High-quality downscaling using the pica library to ensure crisp icons at every resolution',
          'ZIP export with complete icon packs — every size and format each platform requires, generated in your browser',
        ],
      },
      {
        title: 'Platform Support',
        items: [
          'Android: launcher icons at all densities (mdpi through xxxhdpi), adaptive icons, notification icons',
          'iOS: all required App Store sizes and operating system icon variants',
          'Web: complete favicon set including all modern sizes, Apple touch icons, and mask icons',
          'Desktop: Windows ICO and macOS ICNS formats with all required resolutions',
        ],
      },
      {
        title: 'User Experience',
        items: [
          'Clean, minimal interface designed for speed — upload to export in under a minute',
          'Dark and light themes that follow your system preference or manual toggle',
          'Responsive layout that works on desktop and tablet screens',
          'Keyboard shortcuts for power users: undo, redo, upload, export, grid toggle, and command palette',
          'Drag-and-drop upload with support for PNG, JPG, SVG, and WEBP formats',
        ],
      },
      {
        title: 'Privacy & Architecture',
        items: [
          '100% client-side — every operation runs in your browser using the Canvas API',
          'Zero server uploads — your images never leave your device during any stage of processing',
          'No user accounts, no data collection, no tracking cookies, no analytics scripts',
          'Progressive Web App with offline support — install and use without an internet connection',
          'Service worker for reliable caching and offline access to the editor',
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <History className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
          <p className="text-sm text-muted-foreground">Release history and product updates</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      {releases.map((release) => (
        <div key={release.version} className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <release.icon className="size-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{release.version}</h2>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{release.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{release.tagline}</p>
            </div>
          </div>

          <div className="space-y-4">
            {release.sections.map((section) => (
              <div key={section.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <h3 className="font-semibold mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary/40" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RefreshCw className="size-5 text-primary" />
          <h2 className="font-semibold">Stay Updated</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          We are actively developing CloudIcon Studio. New features, platform improvements, and performance enhancements are shipped regularly. Check back often or{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">reach out</a>
          {' '}to suggest what you would like to see next.
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
