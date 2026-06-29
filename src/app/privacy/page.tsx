import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Server, Eye, FileSearch, Mail } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy — App Icon Generator | CloudIcon Studio',
  description: 'CloudIcon Studio processes all images entirely in your browser. No image data is ever uploaded to any server. Your privacy is fully protected — no tracking, no accounts, no data collection.',
  keywords: ['CloudIcon Studio privacy policy', 'app icon generator privacy', 'client-side processing', 'no data upload', 'privacy-first icon generator', 'browser-based privacy', 'no tracking icon tool'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.vercel.app/privacy' },
  openGraph: {
    title: 'Privacy Policy — App Icon Generator | CloudIcon Studio',
    description: 'CloudIcon Studio is privacy-first. All image processing happens in your browser — zero uploads, zero tracking, zero data collection.',
    url: 'https://cloudicon.vercel.app/privacy',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio privacy policy — no data uploads' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — CloudIcon Studio',
    description: 'All image processing happens in your browser. Nothing is uploaded. No tracking. No data collection.',
    images: ['/og-image.png'],
  },
};

const sections = [
  {
    icon: Shield,
    title: 'Our Commitment to Your Privacy',
    content: `Privacy is not an afterthought at CloudIcon Studio. It is the foundation upon which the entire application is built. Unlike most online tools that upload your files to remote servers for processing, CloudIcon Studio does everything inside your own browser. Your images, your creative work, and your personal data never leave your device. We designed it this way not because it was easier, but because it was the right thing to do. In an age where data breaches and privacy violations have become commonplace, we wanted to offer something different — a tool that respects your privacy by default, without requiring you to read a lengthy privacy policy to understand what happens to your data. The short version is simple: we do not collect, store, or transmit any of your personal information. Every image you upload, every icon you generate, and every setting you adjust remains under your control, inside your browser, where it belongs.`,
  },
  {
    icon: Server,
    title: 'What We Store Locally',
    content: `CloudIcon Studio uses your browser's local storage for a few basic convenience features. Local storage is a standard web technology that allows websites to save small amounts of data directly on your computer. Unlike cookies, this data is never automatically transmitted to any server. Here is exactly what we store and why: your theme preference — whether you prefer dark mode or light mode — so you do not have to set it every time you visit. Your cookie consent choice, so the cookie notice does not reappear every time you load the page. And your editor workspace state, which saves your current work-in-progress so that if you accidentally close the browser tab, your adjustments are not lost. That is it. No browsing history, no analytics data, no personal identifiers, no tracking information of any kind. All of this data stays on your device, and you can clear it at any time through your browser settings without affecting your ability to use the tool.`,
  },
  {
    icon: Eye,
    title: 'What We Do Not Do',
    content: `We want to be completely transparent about what CloudIcon Studio does not do. We do not use tracking cookies of any kind. We do not run analytics scripts like Google Analytics, Mixpanel, or any other service that monitors your behavior. We do not collect your IP address, browser fingerprint, or device information. We do not serve advertisements or share data with ad networks. We do not have user accounts, so there is no database of email addresses, names, or passwords. We do not integrate with social media platforms, so there are no like buttons, share buttons, or embedded feeds that track your activity. We do not send your images or data to any third-party service for processing, analysis, or storage. Every single operation — from image upload to icon generation to ZIP export — happens entirely within your browser using standard web technologies like the Canvas API, all running locally on your machine.`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `Because CloudIcon Studio processes everything client-side, the typical security concerns associated with web applications simply do not apply here. There are no servers that could be breached, no databases that could be leaked, and no data in transit that could be intercepted. Your images exist only in the memory of your browser tab. When you close the tab, they are gone. When you download your generated icon pack, the ZIP file is created entirely in your browser — no copy is ever stored on our end. This architecture eliminates entire categories of security risks. There is no attack surface for hackers to exploit because there is no centralized data repository. Your privacy is not just a policy we wrote; it is a technical reality enforced by the way the application is built.`,
  },
  {
    icon: FileSearch,
    title: 'Third-Party Services',
    content: `CloudIcon Studio does not load any third-party scripts, fonts, or resources from external domains — aside from the Next.js framework itself and the Google Fonts used for the Geist typeface. We do not use content delivery networks that track users. We do not embed YouTube videos, Twitter feeds, or any other external content that could compromise your privacy. The only external network requests your browser makes are to load the application itself and the font files used for typography. No analytics, no tracking, no advertising networks. Your visit to CloudIcon Studio is entirely anonymous from the moment you arrive to the moment you leave.`,
  },
  {
    icon: Mail,
    title: 'Questions or Concerns',
    content: `If you have any questions about this privacy policy or how CloudIcon Studio handles your data, we would love to hear from you. We believe in open communication and are happy to explain any aspect of our privacy practices in more detail. You can reach us at support@typely.in, and we will respond personally — no automated replies, no chatbots. We typically get back to you within 24 hours.`,
  },
];

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
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
          Have more questions? We are here to help.{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">support@typely.in</a>
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
