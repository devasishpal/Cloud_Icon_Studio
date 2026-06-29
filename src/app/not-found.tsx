import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found | CloudIcon Studio',
  description: 'The page you are looking for does not exist or has been moved. Return to CloudIcon Studio to generate app icons.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://cloudicon.vercel.app/404' },
  openGraph: {
    title: '404 - Page Not Found | CloudIcon Studio',
    description: 'The page you are looking for does not exist or has been moved.',
    url: 'https://cloudicon.vercel.app/404',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 - Page Not Found | CloudIcon Studio',
    description: 'The page you are looking for does not exist or has been moved.',
    images: ['/og-image.png'],
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <span className="text-2xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
