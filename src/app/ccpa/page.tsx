import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, Eye, Ban, FileCheck, ShieldCheck, Mail } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'CCPA Compliance — App Icon Generator | CloudIcon Studio',
  description: 'CloudIcon Studio is fully CCPA compliant. We do not collect, sell, or share any personal information. All image processing is done entirely client-side in your browser.',
  keywords: ['CloudIcon Studio CCPA', 'CCPA compliance', 'California privacy rights icon generator', 'no data collection icon tool', 'client-side privacy', 'no personal information sold'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.typely.in/ccpa' },
  openGraph: {
    title: 'CCPA Compliance — App Icon Generator | CloudIcon Studio',
    description: 'CloudIcon Studio is CCPA compliant. Zero personal information is collected, sold, or shared. All processing is 100% client-side.',
    url: 'https://cloudicon.typely.in/ccpa',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio CCPA compliance page' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCPA Compliance — CloudIcon Studio',
    description: 'CloudIcon Studio is CCPA compliant. No personal data is collected, sold, or shared.',
    images: ['/og-image.png'],
  },
};

const sections = [
  {
    icon: Scale,
    title: 'Our Commitment Under CCPA',
    content: `The California Consumer Privacy Act (CCPA) grants California residents important rights over their personal information. At CloudIcon Studio, we support these rights wholeheartedly. We believe that privacy is not a luxury or a premium feature — it is a baseline expectation that every online service should meet. The CCPA was enacted to give consumers transparency and control over how businesses collect and use their data. While the regulation applies specifically to California residents, we have designed CloudIcon Studio's privacy practices to meet this standard for every user, regardless of where they live. Our approach is simple: we do not collect personal information. Not from California residents, not from anyone. This means CCPA compliance is not something we had to retroactively implement; it is built into the very architecture of the application. Every design decision we made prioritizes your privacy, and the result is a tool that inherently respects your rights under CCPA and similar regulations worldwide.`,
  },
  {
    icon: Eye,
    title: 'Information We Collect',
    content: `CloudIcon Studio does not collect any personal information from its users. Let us be precise about what this means so there is no ambiguity. We do not collect your name, email address, postal address, phone number, or any other contact information. We do not collect your IP address, which is often considered personal information under CCPA. We do not collect your browsing history, either on our site or elsewhere. We do not collect your device identifiers, browser fingerprint, or any technical information that could be used to identify you across sessions. We do not collect demographic information, interests, or behavioral data. We do not use cookies, web beacons, tracking pixels, or any other technology designed to collect information about you. We do not have user accounts, so there is no registration data. We do not process payments, so there is no financial information. The list of what we do not collect is intentionally exhaustive because we want you to understand that your visit to CloudIcon Studio is truly anonymous.`,
  },
  {
    icon: Ban,
    title: 'Information We Sell or Share',
    content: `CloudIcon Studio does not sell or share any personal information because we do not collect any in the first place. Under CCPA, the terms "sell" and "share" have specific legal meanings that encompass a wide range of data transfer practices common in the modern web, including sharing data with advertisers, analytics providers, and social media platforms. We engage in none of these practices. We do not use Google Analytics or any other analytics service that could be considered a data sale or sharing arrangement. We do not participate in advertising networks, affiliate programs, or retargeting campaigns. We do not integrate with social media platforms in ways that would share your data. We do not use third-party cookies or tracking scripts. We do not sell your data for monetary consideration — but we also do not engage in the broader set of practices that CCPA defines as "sharing" data for cross-context behavioral advertising. In short, there is no data to sell or share because there is no data being collected at all. Your visit is private from start to finish.`,
  },
  {
    icon: FileCheck,
    title: 'Your CCPA Rights',
    content: `The CCPA grants California residents several specific rights regarding their personal information. Here is how each applies to CloudIcon Studio. The right to know — you have the right to request that we disclose the personal information we have collected about you. Since we collect no personal information, our disclosure would be empty, but the right is yours nonetheless. The right to delete — you have the right to request deletion of any personal information we have collected. Since we have none, there is nothing to delete, but your data in local storage can be cleared at any time through your browser settings. The right to opt out of sale or sharing — we do not sell or share personal information, so there is nothing to opt out of. The right to non-discrimination — we will not treat you differently for exercising any of your CCPA rights. Since we have no way to distinguish between users who exercise their rights and those who do not, this right is inherently protected. To exercise any of these rights, simply contact us at support@typely.in, and we will confirm within the legally required timeframe that no personal information is being processed.`,
  },
  {
    icon: ShieldCheck,
    title: 'Data Retention and Security',
    content: `CloudIcon Studio does not retain any personal information because we do not collect any. The only data associated with your use of the tool is stored locally in your browser's local storage — specifically your theme preference, cookie consent choice, and editor workspace state. This data remains on your device until you choose to clear it. You can delete it at any time through your browser settings with no impact on your ability to use the tool. From a security perspective, the client-side architecture of CloudIcon Studio eliminates many of the data protection risks that traditional web applications face. Since we do not operate servers that store user data, there are no databases that could be breached and no data repositories that could be exfiltrated. Your images exist only in the memory of your browser tab and are permanently deleted when you close the tab. This architecture is not just good privacy practice — it is the most effective form of data security possible, because data that does not exist cannot be stolen or misused.`,
  },
  {
    icon: Mail,
    title: 'Contact for CCPA Inquiries',
    content: `If you are a California resident with questions about your CCPA rights, or if you would like to exercise any of the rights described above, please contact us at support@typely.in. We are committed to responding to all verified requests within the timeframe required by law — typically within 45 days of receipt. Since we do not collect personal information, verification of your identity for CCPA requests is straightforward: there is no data to match against. We simply confirm that we hold no personal information related to your request. We respond to every inquiry personally and promptly. You can also reach out if you have general questions about how CCPA applies to client-side web applications or if you would like more detail about any aspect of our data practices. We believe in transparency and are happy to provide thorough explanations.`,
  },
];

export default function CcpaPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Scale className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CCPA Compliance</h1>
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
          California resident with CCPA questions?{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">support@typely.in</a>
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
