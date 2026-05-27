import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Database, Eye, FileCheck, Lock, Mail } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'GDPR Compliance — App Icon Generator | CloudIcon Studio',
  description: 'CloudIcon Studio is fully GDPR compliant. As a 100% client-side application, no personal data is collected, processed, or stored on servers. Your data stays in your browser.',
  keywords: ['CloudIcon Studio GDPR', 'GDPR compliance icon generator', 'data protection', 'EU privacy rights', 'client-side app icon tool', 'no data collection icon generator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.studio/gdpr' },
  openGraph: {
    title: 'GDPR Compliance — App Icon Generator | CloudIcon Studio',
    description: 'CloudIcon Studio is fully GDPR compliant. All data remains in your browser. Zero cookies, zero analytics, zero tracking scripts.',
    url: 'https://cloudicon.studio/gdpr',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio GDPR compliance page' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDPR Compliance — CloudIcon Studio',
    description: 'Fully GDPR compliant. 100% client-side app icon generator. No data leaves your browser.',
    images: ['/og-image.png'],
  },
};

const sections = [
  {
    icon: Shield,
    title: 'Our Commitment to GDPR',
    content: `The General Data Protection Regulation (GDPR) is one of the most comprehensive privacy frameworks in the world, designed to give individuals control over their personal data. At CloudIcon Studio, we fully embrace both the letter and the spirit of the GDPR. We believe that privacy is a fundamental right, not a compliance checkbox. While many companies treat GDPR as a bureaucratic hurdle to be minimally satisfied, we built CloudIcon Studio from the ground up to be privacy-first. This means that GDPR compliance is not something we had to retrofit — it is inherent in how the application works. Because CloudIcon Studio processes everything in your browser and collects no personal data, we naturally meet the highest standards of data protection without having to implement complex compliance measures. Your data stays with you, under your control, at all times.`,
  },
  {
    icon: Database,
    title: 'Data Collection and Processing',
    content: `CloudIcon Studio collects zero personal data. Let us be explicit about what that means: we do not collect your name, email address, IP address, browser fingerprint, device information, location data, or any other personally identifiable information. We do not require you to create an account, sign up for a newsletter, or provide any information to use the tool. There is no login system, no registration form, no email capture. You can visit CloudIcon Studio, generate icons for hours, and leave without ever telling us who you are. Regarding data processing under GDPR definitions, CloudIcon Studio acts as a data processor in a very limited sense — but since there is no personal data being processed, the practical implications are minimal. The images you upload and the icons you generate are processed entirely within your browser using the Canvas API and Fabric.js. They are never transmitted to our servers or any third-party service. They exist only in the memory of your browser tab and are permanently deleted when you close the tab or clear your browser data.`,
  },
  {
    icon: Eye,
    title: 'Your Rights Under GDPR',
    content: `The GDPR grants individuals several specific rights regarding their personal data. Here is how each of those rights applies to CloudIcon Studio: the right to be informed — we have explained in detail what data we do and do not collect. The right of access — since we hold none of your data on our servers, there is nothing to access. The right to rectification — there is no personal data stored that could be incorrect. The right to erasure (right to be forgotten) — your data exists only in your browser, and you can delete it at any time by clearing your browser's local storage or closing the tab. The right to restrict processing — there is no processing of personal data to restrict. The right to data portability — we do not hold your data in any portable format because we do not hold it at all. The right to object — there is no processing of personal data to object to. Rights related to automated decision-making — we do not engage in automated profiling or decision-making based on personal data. Every single GDPR right is inherently fulfilled because we built our application around the principle of data minimization.`,
  },
  {
    icon: FileCheck,
    title: 'Lawful Basis for Processing',
    content: `Under GDPR, any processing of personal data must have a lawful basis. Since CloudIcon Studio does not process any personal data, the question of lawful basis is largely moot. However, to be thorough: the local storage data we use (theme preference, cookie consent, editor state) is stored on your device by your browser at your direction. You actively choose to use the tool, and the local storage is a technical necessity for the convenience features you expect. The lawful basis for this limited local storage could be considered legitimate interest (providing a functional, convenient tool) or explicit consent (by choosing to use the tool and its features). No personal data is ever transmitted to us, so no lawful basis is needed for data transfer or third-party processing. We have structured the application specifically to avoid any scenario where GDPR compliance would be complex or ambiguous.`,
  },
  {
    icon: Lock,
    title: 'Data Security and Transfers',
    content: `CloudIcon Studio does not transfer any personal data across borders because there is no personal data to transfer. All processing occurs locally in your browser on your device. This architecture inherently addresses the GDPR's restrictions on international data transfers — since no data leaves your device, there are no cross-border transfer concerns. From a security perspective, the client-side architecture eliminates many common attack vectors. There are no servers containing user data that could be breached. There are no databases of personal information that could be leaked. There are no data pipelines where information could be intercepted. Your images and data are processed in your browser's memory and exist only for the duration of your session. When you close the tab, everything is gone. This is not a security feature we added; it is a natural consequence of building a tool that runs entirely on the client side.`,
  },
  {
    icon: Mail,
    title: 'Contact and DPO Information',
    content: `While CloudIcon Studio does not collect personal data and therefore does not strictly require a Data Protection Officer under GDPR guidelines, we are committed to transparent communication about privacy matters. If you have any questions about GDPR compliance, data handling, or privacy practices, you can reach us at support@typely.in. We respond to every inquiry personally — no automated replies, no support tickets, no chatbots. Whether you are a data protection officer conducting due diligence, a user exercising your privacy rights, or simply someone curious about how we handle data, we are happy to provide detailed answers. We typically respond within 24 hours.`,
  },
];

export default function GdprPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GDPR Compliance</h1>
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
          Questions about GDPR or data privacy?{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">support@typely.in</a>
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
