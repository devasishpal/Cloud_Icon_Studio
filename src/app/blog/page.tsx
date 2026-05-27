import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Blog - CloudIcon Studio',
  description: 'Articles and updates about app icon design, generation tips, and best practices for Android, iOS, Web, and Desktop icons.',
  keywords: ['app icon blog', 'icon design tips', 'app icon best practices', 'Android icon guide', 'iOS icon guide', 'favicon design'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.studio/blog' },
  openGraph: {
    title: 'Blog — CloudIcon Studio',
    description: 'Articles and updates about app icon design, generation tips, and best practices for Android, iOS, Web, and Desktop icons.',
    url: 'https://cloudicon.studio/blog',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — CloudIcon Studio',
    description: 'App icon design tips, best practices, and updates.',
    images: ['/og-image.png'],
  },
};

export default function BlogPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Blog</h1>
      <p className="text-muted-foreground">Coming soon. Stay tuned for tips on crafting perfect app icons.</p>
    </main>
    </PageLayout>
  );
}
