import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { Upload, Sliders, Eye, Download, Image, Shapes, Palette, Smartphone, ArrowRight, Zap, Shield } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'How to Make App Icons — Step-by-Step Guide',
  description: 'Learn how to generate app icons for Android, iOS, Web & Desktop with CloudIcon Studio. Upload, customize, preview, and export in under a minute — 100% in your browser.',
  keywords: ['how to make app icons', 'app icon generator guide', 'how app icon generator works', 'create app icons', 'icon generator tutorial', 'browser-based icon tool', 'app icon creation guide', 'generate app icons online'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.typely.in/how-it-works' },
  openGraph: {
    title: 'How to Make App Icons — Step-by-Step Guide',
    description: 'Upload once, generate production-ready icons for Android, iOS, Web, and Desktop. Complete guide with step-by-step instructions.',
    url: 'https://cloudicon.typely.in/how-it-works',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio app icon generator guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Make App Icons — Step-by-Step Guide',
    description: 'Generate app icons for every platform in under a minute. 100% client-side, zero uploads.',
    images: ['/og-image.png'],
  },
};

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Image',
    summary: 'Drop your artwork into the browser — that is the only step.',
    details: 'Start by dragging and dropping your image onto the upload area or clicking to select a file. CloudIcon Studio supports PNG, JPG, SVG, and WEBP formats, and there is no file size limit. The moment your image loads, it is ready for editing. There are no account creation steps, no email sign-ups, and no waiting for server processing. Your image stays entirely on your device and is never transmitted anywhere. This is not just a privacy feature — it also means you get instant feedback as soon as you upload.',
  },
  {
    icon: Sliders,
    title: 'Customize Every Detail',
    summary: 'Fine-tune your icon with precise controls that update in real time.',
    details: 'The left panel gives you complete creative control over your icon. Adjust the rotation to get the perfect angle for your logo or artwork. Add a solid color or gradient background that matches your brand — or keep it transparent. Control the padding to ensure your icon has the right breathing room on every platform. Use the crop tool to trim unwanted edges and focus on the most important part of your design. The safe area overlay shows you exactly which portion of your icon is guaranteed to be visible on every device, so critical content never gets clipped. Every adjustment updates instantly — there is no render button to click and no waiting for previews.',
  },
  {
    icon: Palette,
    title: 'Choose Your Style',
    summary: 'Pick the shape and background that fit your platform.',
    details: 'Different platforms use different icon shapes and masks. Android uses adaptive icons with a foreground and background layer inside a cutout mask. iOS applies a rounded rectangle mask with specific corner radius. Web favicons are typically squares, and desktop icons have their own conventions. CloudIcon Studio handles all of this automatically. You can choose from circle, rounded square, squircle, and platform-specific shapes — the preview updates immediately so you can see exactly how your icon will look on each platform before you export. The shape tool also accounts for safe zones, ensuring your design stays centered and visible regardless of the mask applied by the operating system.',
  },
  {
    icon: Eye,
    title: 'Preview on Real Devices',
    summary: 'See your icon on device mockups before you export.',
    details: 'The right panel displays your icon on realistic device mockups for Android, iOS, Web, and Desktop. These are not generic placeholders — each mockup accurately reflects the platform-specific icon mask, safe zone, and rendering behavior. You can switch between platforms instantly to compare how your icon looks on each one. The preview updates live as you make changes, so you can iterate quickly without guesswork. Toggle between light and dark mode to make sure your icon looks great in both contexts. Zoom in to inspect fine details, and use the grid overlay to verify alignment. This instant visual feedback is what sets CloudIcon Studio apart from batch generators that only show you the final result after export.',
  },
  {
    icon: Smartphone,
    title: 'Export for Every Platform',
    summary: 'Download a complete icon pack as a ZIP — all sizes, all formats.',
    details: 'When you are satisfied with your design, click "Generate & Download" and CloudIcon Studio creates a complete ZIP archive containing every icon size and format each platform requires. For Android, that includes launcher icons at all screen densities from mdpi through xxxhdpi, plus adaptive icon layers and notification icons. For iOS, you get every size required by the App Store and the operating system — from the smallest notification icon to the largest iPad Pro icon. For the web, a full favicon set is generated including all modern sizes, Apple touch icons, and mask icons. For desktop, both Windows ICO and macOS ICNS formats are included with all required resolutions. The ZIP file is created entirely in your browser — no copy is ever stored on our servers, and you can export as many times as you like.',
  },
];

const highlights = [
  {
    icon: Shield,
    title: '100% Client-Side',
    description: 'Every operation runs in your browser. Your images never touch a server.',
  },
  {
    icon: Zap,
    title: 'Takes Under a Minute',
    description: 'Upload, customize, preview, and export — all in about 60 seconds.',
  },
  {
    icon: Download,
    title: 'Complete Icon Packs',
    description: 'Every size and format for Android, iOS, Web, and Desktop in one ZIP.',
  },
];

const howItWorksSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://cloudicon.typely.in/how-it-works#howto',
  name: 'How to Make App Icons with CloudIcon Studio',
  description: 'Learn how to generate app icons for Android, iOS, Web & Desktop. Upload, customize, preview, and export in under a minute — 100% in your browser.',
  image: 'https://cloudicon.typely.in/og-image.png',
  estimatedTime: 'PT1M',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Upload Your Image',
      text: 'Drop your artwork into the browser. CloudIcon Studio supports PNG, JPG, SVG, and WEBP formats. No account required, no file size limit.' },
    { '@type': 'HowToStep', position: 2, name: 'Customize Every Detail',
      text: 'Use the left panel to adjust rotation, add background color or gradient, control padding, crop unwanted edges, and choose your icon shape.' },
    { '@type': 'HowToStep', position: 3, name: 'Preview on Real Devices',
      text: 'See your icon on realistic device mockups for Android, iOS, Web, and Desktop. Toggle between platforms, zoom in, and check light/dark mode.' },
    { '@type': 'HowToStep', position: 4, name: 'Export for Every Platform',
      text: 'Download a complete ZIP archive with every icon size and format for Android, iOS, Web, and Desktop. All generated in your browser.' },
  ],
};

export default function HowItWorksPage() {
  return (
    <PageLayout>
    <Script id="how-it-works-schema" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(howItWorksSchema)}
    </Script>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Image className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">How It Works</h1>
          <p className="text-sm text-muted-foreground">From upload to export in under a minute</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          CloudIcon Studio turns your artwork into production-ready app icons for every major platform. The entire process happens in your browser — nothing is uploaded, no account is required, and you can go from start to finish in about a minute. Here is exactly how it works, step by step.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-xl border border-border bg-card p-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
                <h.icon className="size-5 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">{h.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{h.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6 mb-8">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                <step.icon className="size-5 text-primary" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shrink-0">{index + 1}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{step.title}</h2>
                    <p className="text-sm text-muted-foreground">{step.summary}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <h2 className="font-semibold mb-2">Ready to try it?</h2>
        <p className="text-sm text-muted-foreground mb-4">No sign-up, no uploads, no servers. Just drag, customize, and download.</p>
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)' }}
        >
          Generate Your Icons Now
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
    </PageLayout>
  );
}
