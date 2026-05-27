import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, UserCheck, AlertCircle, Handshake, Scale, Mail } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Terms of Service — Free App Icon Generator | CloudIcon Studio',
  description: 'CloudIcon Studio Terms of Service. Free to use for personal and commercial projects. You retain all rights to your images and generated icons. No royalties, no attribution required.',
  keywords: ['CloudIcon Studio terms of service', 'free icon generator terms', 'commercial use icon generator', 'app icon license terms', 'free for commercial use icon tool'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.studio/terms' },
  openGraph: {
    title: 'Terms of Service — Free App Icon Generator | CloudIcon Studio',
    description: 'CloudIcon Studio is free to use for personal and commercial projects. You retain all rights to your images and generated icons.',
    url: 'https://cloudicon.studio/terms',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio terms of service free app icon generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — CloudIcon Studio',
    description: 'Free app icon generator — free for personal and commercial use. You retain all rights.',
    images: ['/og-image.png'],
  },
};

const sections = [
  {
    icon: Handshake,
    title: 'Agreement Overview',
    content: `By using CloudIcon Studio, you agree to these terms. They are designed to be fair, straightforward, and easy to understand. We have deliberately avoided legal jargon and convoluted clauses because we believe terms of service should be readable by actual humans. CloudIcon Studio is a free, browser-based tool that helps you generate app icons for various platforms. That is what it does, and that is all it does. If you use it, these terms apply. If you do not agree with any part of these terms, please do not use the service. It is that simple. We may update these terms from time to time — if we do, we will update the date at the top of this page. Continuing to use CloudIcon Studio after changes means you accept the updated terms.`,
  },
  {
    icon: UserCheck,
    title: 'Your Rights and Ownership',
    content: `You retain full ownership of everything you upload to and generate with CloudIcon Studio. Every image you upload, every icon you create, every setting you configure — it all belongs to you. We do not claim any ownership, license, or rights to your creative work. You are free to use the icons you generate for any purpose: personal projects, commercial applications, client work, open-source software, merchandise, or anything else you can imagine. There are no royalties, no attribution requirements, and no usage restrictions on the output. We simply provide the tool that helps you create them. The icons are yours, period. We encourage you to use CloudIcon Studio to bring your app ideas to life, whatever those ideas may be.`,
  },
  {
    icon: AlertCircle,
    title: 'Acceptable Use',
    content: `CloudIcon Studio is designed to help people create app icons for legitimate projects. While we trust our users to use the tool responsibly, there are a few things that are off limits. You may not use CloudIcon Studio to generate icons for illegal content, hate speech, violent imagery, harassment, or any material that violates the legal rights of others. You may not attempt to reverse-engineer, abuse, or disrupt the service. You may not use automated scripts or bots to interact with the tool in ways that could degrade the experience for other users. These restrictions are common sense — treat others with respect, follow the law, and do not break things. If we become aware of abusive usage, we reserve the right to block access, though we have never had to do so and hope we never will.`,
  },
  {
    icon: Scale,
    title: 'Service Availability and Disclaimer',
    content: `CloudIcon Studio is provided as a free tool, and we work hard to keep it running smoothly. However, we cannot guarantee that it will be available at all times without interruption. The service may occasionally be unavailable due to maintenance, updates, or circumstances beyond our control. We are not responsible for any loss or damage arising from your use of the tool, including but not limited to lost time, lost data, or any indirect damages. Because the tool runs entirely in your browser, we have no access to your images or data, and therefore cannot be held responsible for their loss or misuse. We recommend reviewing your generated icons before publishing them to ensure they meet your quality standards and platform requirements.`,
  },
  {
    icon: FileText,
    title: 'Intellectual Property',
    content: `CloudIcon Studio itself — the software, design, branding, and underlying code — is our intellectual property. You may not copy, modify, distribute, or create derivative works of the CloudIcon Studio application without our explicit permission. The CloudIcon name and logo are our trademarks. This does not affect your rights to the icons you generate using the tool. Our intellectual property covers the tool itself; yours covers the creative output. We believe this is a fair and standard distinction. If you are interested in using any part of our branding or technology for a project, please reach out — we are generally open to collaboration and licensing discussions.`,
  },
  {
    icon: Mail,
    title: 'Getting in Touch',
    content: `If you have questions about these terms, concerns about a specific use case, or just want to talk, we are always available. Email us at support@typely.in and a real person will respond. We do not use support tickets, chatbots, or automated responses. Every email is read and answered by a member of our small team. We typically respond within 24 hours, often sooner. Whether you are a designer building icons for your next app launch, a developer integrating icon generation into your workflow, or just someone who stumbled upon the tool and has a question — we would love to hear from you.`,
  },
];

export default function TermsPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
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
          Questions about these terms?{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">support@typely.in</a>
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
