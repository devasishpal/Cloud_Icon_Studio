import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, Database, ShieldCheck, Globe, Settings, Mail } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Cookie Policy — No Tracking Cookies | CloudIcon Studio',
  description: 'CloudIcon Studio does not use tracking cookies. We use local storage only for theme preferences and editor state. No data is ever sent to external servers or third parties.',
  keywords: ['CloudIcon Studio cookie policy', 'no tracking cookies', 'local storage only', 'cookie-free app icon generator', 'browser privacy', 'no cookies icon tool'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.typely.in/cookies' },
  openGraph: {
    title: 'Cookie Policy — No Tracking Cookies | CloudIcon Studio',
    description: 'CloudIcon Studio does not use tracking cookies. Local storage only for preferences. Zero third-party scripts, zero analytics, zero tracking.',
    url: 'https://cloudicon.typely.in/cookies',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio cookie policy — no tracking cookies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy — CloudIcon Studio',
    description: 'CloudIcon Studio does not use tracking cookies. Your privacy is fully protected.',
    images: ['/og-image.png'],
  },
};

const sections = [
  {
    icon: Cookie,
    title: 'Our Approach to Cookies',
    content: `CloudIcon Studio does not use tracking cookies. Not for analytics, not for advertising, not for personalization, not for anything. We made this decision deliberately because we believe your browsing activity is your own business. The web has become cluttered with tracking scripts that follow users across sites, building detailed profiles of their behavior without their meaningful consent. We wanted no part of that. When you visit CloudIcon Studio, your browser does not receive any cookies designed to identify you, track your movements, or remember your behavior. There are no persistent identifiers stored on your device for tracking purposes. You can browse every page of our site with the confidence that your visit is completely anonymous. We do not know who you are, what you are working on, or how you found us — and we prefer it that way.`,
  },
  {
    icon: Database,
    title: 'Local Storage vs. Cookies',
    content: `Instead of cookies, CloudIcon Studio uses your browser's built-in local storage for a few basic convenience features. Local storage and cookies are often confused, but they work very differently. Cookies are small text files that are automatically sent back to the server with every request, which is what makes them useful for tracking. Local storage, on the other hand, stays on your device. Data written to local storage remains there until you or the application explicitly removes it. No data is automatically transmitted anywhere. Specifically, we use local storage to remember your theme preference (dark or light mode), your cookie consent choice (so the notice does not reappear), and your editor workspace state (so your unsaved work survives accidental tab closures). None of this information identifies you personally, and none of it ever leaves your browser.`,
  },
  {
    icon: ShieldCheck,
    title: 'No Third-Party Tracking',
    content: `CloudIcon Studio does not load any third-party scripts, widgets, or services that set their own cookies or track user behavior. We do not use Google Analytics, Facebook Pixel, Hotjar, Mixpanel, or any other analytics platform. There are no embedded YouTube videos, Twitter feeds, Instagram embeds, or social media share buttons on our site — all of which are common sources of third-party tracking cookies. We do not participate in advertising networks or affiliate programs. We do not use retargeting pixels or conversion tracking. The code running on CloudIcon Studio is written and maintained by us, and we have deliberately excluded any third-party dependencies that could compromise your privacy. When you use CloudIcon Studio, the only network requests your browser makes are to load the application itself and to fetch the font files used for typography. That is the complete list.`,
  },
  {
    icon: Settings,
    title: 'Managing Your Preferences',
    content: `If you have already consented to the use of local storage on CloudIcon Studio and would like to change your mind, you can clear your data at any time through your browser settings. In most browsers, you can clear local storage by opening the developer tools, navigating to the Application or Storage tab, and selecting Clear Site Data. You can also clear your browser's entire cache and site data from the privacy or history settings. Clearing this data will remove your saved preferences, including your theme choice and cookie consent setting, but it will not affect your ability to use the tool. You may be asked to set your preferences again the next time you visit. Please note that since we do not use traditional cookies, there is no need to manage cookie settings through your browser's cookie controls — local storage is managed separately.`,
  },
  {
    icon: Globe,
    title: 'Why No Cookies?',
    content: `We designed CloudIcon Studio without tracking cookies because we believe the web can be better than the current status quo. The default behavior for most websites is to track as much as possible, as if user data is a resource to be extracted. We reject that approach. Privacy should be the default, not an opt-out option buried in a settings menu. By building CloudIcon Studio to be completely cookie-free, we remove the need for cookie consent banners, privacy policy pop-ups, and the endless cycle of clicking "Accept All" just to use a simple tool. We want your experience to be clean, fast, and respectful. No tracking means no data brokers, no behavioral profiles, no targeted ads based on your icon design preferences. Just a tool that does what it says and leaves you alone.`,
  },
  {
    icon: Mail,
    title: 'Questions About Our Cookie Policy',
    content: `If you have any questions about how CloudIcon Studio handles cookies, local storage, or your data in general, we welcome your inquiry. We take privacy seriously and are happy to explain any aspect of our data practices in plain language. You can reach us at support@typely.in, and a real person will respond. We do not use automated responses or support tickets. Every email is read and answered personally, typically within 24 hours. Whether you are a privacy-conscious user doing your due diligence, a developer curious about our architecture, or someone with a specific concern — we would love to hear from you and address your questions directly.`,
  },
];

export default function CookiesPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Cookie className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 16, 2026</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                <section.icon className="size-5 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Questions about cookies or local storage?{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">support@typely.in</a>
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
