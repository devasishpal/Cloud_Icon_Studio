'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbLabels: Record<string, string> = {
  '/editor': 'Editor',
  '/blog': 'Blog',
  '/docs': 'Documentation',
  '/how-it-works': 'How It Works',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/changelog': 'Changelog',
  '/status': 'Service Status',
  '/cookies': 'Cookie Policy',
  '/ccpa': 'CCPA Compliance',
  '/gdpr': 'GDPR Compliance',
};

function getLabel(segment: string): string {
  return breadcrumbLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/editor') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [];

  let cumulative = '';
  for (const segment of segments) {
    cumulative += '/' + segment;
    crumbs.push({ href: cumulative, label: getLabel(cumulative) });
  }

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="size-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
            {i === crumbs.length - 1 ? (
              <span className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className={cn(
                  'hover:text-foreground transition-colors truncate max-w-[200px]',
                )}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
