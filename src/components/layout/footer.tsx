'use client';

import {
  Heart,
  Globe,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { GitHubIcon } from '@/components/icons/github-icon';
import { GITHUB_URL } from '@/lib/constants';

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
    title: 'Platforms',
    links: [
      { label: 'Android Icons', href: '/editor' },
      { label: 'iOS Icons', href: '/editor' },
      { label: 'Favicon Generator', href: '/editor' },
      { label: 'Desktop Icons', href: '/editor' },
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
      { label: 'GDPR', href: '/gdpr' },
      { label: 'CCPA', href: '/ccpa' },
    ],
  },
];

const socialLinks = [
  {
    label: 'GitHub repository',
    href: GITHUB_URL,
    icon: GitHubIcon,
    external: true,
  },
  {
    label: 'CloudIcon Studio home',
    href: '/',
    icon: Globe,
    external: false,
  },
  {
    label: 'Contact support',
    href: '/contact',
    icon: Mail,
    external: false,
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-gradient-to-b from-background via-background to-muted/25">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-[15%] size-80 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -bottom-52 right-[10%] size-96 rounded-full bg-accent-2/[0.07] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="flex flex-col gap-5 border-b border-border/50 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <div className="max-w-xl">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="size-3" />
              Ship faster
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Ready to generate your complete icon pack?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Every platform, every size — rendered locally in your browser. No accounts, no uploads.
            </p>
          </div>
          <Link
            href="/editor"
            className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
          >
            Open the editor
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 py-12 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="CloudIcon Studio Home">
              <div className="flex size-11 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-primary/10 shadow-sm transition-colors group-hover:bg-primary/15">
                <Image src="/icon-192.png" alt="CloudIcon Studio logo" width={38} height={38} className="shrink-0 rounded-[9px] object-contain" />
              </div>
              <span
                className="text-lg font-extrabold tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CloudIcon Studio
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A free, professional app icon editor. Create production-ready launcher icons,
              adaptive icons, favicons, and complete export packs for Android, iOS, Web, and
              Desktop — entirely in your browser.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ label, href, icon: Icon, external }) =>
                external ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </Link>
                )
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                <ShieldCheck className="size-3 text-emerald-500" />
                100% client-side
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                <Zap className="size-3 text-amber-500" />
                Instant export
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="transition-transform group-hover:translate-x-0.5">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-border/50 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{' '}CloudIcon Studio. Crafted for designers &amp; developers.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <GitHubIcon className="size-3.5" />
              Star on GitHub
            </a>
            <span className="hidden h-3 w-px bg-border/60 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              Made with <Heart className="size-3 fill-red-500 text-red-500" /> in the browser
            </span>
            <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
