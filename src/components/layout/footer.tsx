'use client';

import { Heart, Globe, ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'App Icon Generator', href: '/editor' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Platform Tools',
    links: [
      { label: 'Android Icon Generator', href: '/editor' },
      { label: 'iOS Icon Generator', href: '/editor' },
      { label: 'Favicon Generator', href: '/editor' },
      { label: 'Desktop Icon Maker', href: '/editor' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
      { label: 'Service Status', href: '/status' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Support', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR Compliance', href: '/gdpr' },
      { label: 'CCPA Compliance', href: '/ccpa' },
    ],
  },
  {
    title: 'Popular Searches',
    links: [
      { label: 'Free App Icon Maker', href: '/editor' },
      { label: 'Adaptive Icon Generator', href: '/editor' },
      { label: 'App Icon Creator Online', href: '/editor' },
      { label: 'Icon Pack Generator', href: '/editor' },
      { label: 'Mipmap Icon Generator', href: '/editor' },
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
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4" aria-label="CloudIcon Studio Home">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors overflow-hidden shrink-0">
                <Image src="/icon.png" alt="CloudIcon Studio logo" width={36} height={36} className="object-contain shrink-0" />
              </div>
              <span className="text-lg font-extrabold tracking-wide" style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CloudIcon Studio</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 pr-4">
              CloudIcon Studio is a free online app icon generator and editor. Create polished
              production-ready launcher icons, favicons, adaptive icons, and complete icon packs
              for Android, iOS, Web, and Desktop — entirely in your browser. No uploads, no accounts.
            </p>
            <div className="flex items-center gap-1.5 mb-5">
              <Link href="/" className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" aria-label="CloudIcon Home">
                <Globe className="size-4" />
              </Link>
              <Link href="/blog" className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" aria-label="CloudIcon Blog">
                <ExternalLink className="size-4" />
              </Link>
              <Link href="/contact" className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" aria-label="Contact CloudIcon">
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
