'use client';

import { Heart, Globe, ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Platforms', href: '#platforms' },
      { label: 'How it Works', href: '/how-it-works' },
      { label: 'Launch Editor', href: '#upload-area' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
      { label: 'CCPA', href: '/ccpa' },
    ],
  },
];

export function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors overflow-hidden shrink-0">
                <Image src="/icon.png" alt="CloudIcon" width={36} height={36} className="object-contain shrink-0" />
              </div>
              <span className="text-lg font-extrabold tracking-wide" style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CloudIcon Studio</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 pr-4">
              Generate polished app icons for every platform — Android, iOS, Web, and Desktop.
              100% client-side, zero uploads.
            </p>
            <div className="flex items-center gap-1.5">
              <Link href="/" className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" aria-label="Website">
                <Globe className="size-4" />
              </Link>
              <Link href="/blog" className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" aria-label="Blog">
                <ExternalLink className="size-4" />
              </Link>
              <Link href="/contact" className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" aria-label="Email">
                <Mail className="size-4" />
              </Link>
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollTo(link.href)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CloudIcon Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 text-xs">
              Made with <Heart className="size-3 text-red-500 fill-red-500" /> in browser
            </span>
            <span className="rounded-full border border-border/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
