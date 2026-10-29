'use client';

import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/page-layout';
import { HeroSection } from '@/components/hero-section';
import { ShowcaseSection } from '@/components/home/showcase-section';
import {
  Smartphone, Apple, Globe, Monitor, Sparkles, Shield, Server, Users, Layers,
  ChevronDown, Package, ArrowRight, Grid, Lock, Eye, Sliders, Wand2
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Layers, value: '4', label: 'Platforms Covered' },
  { icon: Package, value: '95+', label: 'Files in Full Pack' },
  { icon: Server, value: '100%', label: 'Client-Side Processing' },
  { icon: Shield, value: '0', label: 'Artwork Uploads' },
];

const useCases = [
  {
    icon: Smartphone,
    title: 'App Developers',
    desc: 'Generate production-ready icon sets for Android, iOS, and cross-platform apps from a single master asset.',
  },
  {
    icon: Globe,
    title: 'Web Developers',
    desc: 'Create favicons, PWA manifest icons, and apple-touch-icons at every size needed for modern web apps.',
  },
  {
    icon: Monitor,
    title: 'Designers',
    desc: 'Preview how your icon artwork looks across all platforms and devices before handing off to developers.',
  },
  {
    icon: Users,
    title: 'Indie Creators',
    desc: 'Ship your app or game with a complete, professional icon set without needing a design tool or server.',
  },
];

const whyChoose = [
  {
    icon: Lock,
    title: 'Privacy First — Zero Artwork Uploads',
    desc: 'Your images never leave your device. Rendering, cropping, background removal, and ZIP creation all run in your browser. There is no image server, no account, and no artwork storage.',
  },
  {
    icon: Wand2,
    title: 'Local AI Background Removal',
    desc: 'Remove backgrounds with a bundled U2Net model running on-device via WebAssembly, or use the precise chroma-key tool for flat-colour logos. Both are fully offline-capable.',
  },
  {
    icon: Grid,
    title: 'Every Size, Every Format',
    desc: 'Android launcher and adaptive icons, all 19 iOS AppIcon sizes, web favicons and PWA assets, Windows ICO, macOS ICNS, and Linux PNGs — 95+ files in the full pack.',
  },
  {
    icon: Package,
    title: 'Structured ZIP Exports',
    desc: 'Files are organized into platform-ready folders such as android/mipmap-*, iOS/AppIcon.appiconset, web/, and desktop/, with manifests and Contents.json included.',
  },
  {
    icon: Eye,
    title: 'Real-Time Device Previews',
    desc: 'See the same renderer output on Android, iOS, Web, and Desktop mockups. Every edit updates the existing preview section live, with no separate preview mode.',
  },
  {
    icon: Sliders,
    title: 'Full Editing Toolset',
    desc: 'Crop, rotate, zoom, pan, padding, fit modes, solid/gradient/transparent backgrounds, five shape masks, adjustments, shadows, borders, and flips — with undo and redo.',
  },
];

const exportDetails = [
  {
    platform: 'Android',
    icon: Smartphone,
    color: '#3DDC84',
    sizes: 'Launcher + round icons at 36×36 (ldpi), 48×48 (mdpi), 72×72 (hdpi), 96×96 (xhdpi), 144×144 (xxhdpi), 192×192 (xxxhdpi); adaptive foreground/background at 108–432; monochrome layer at 432; notification icons 18–96; 512×512 Play Store icon; adaptive-icon XML and background colour resource.',
  },
  {
    platform: 'iOS',
    icon: Apple,
    color: '#007AFF',
    sizes: '19 AppIcon PNGs from 20×20 to 1024×1024 covering iPhone, iPad, Notification, Settings, Spotlight, and App Store, plus a correctly formatted Contents.json asset catalog.',
  },
  {
    platform: 'Web',
    icon: Globe,
    color: '#4285F4',
    sizes: '16/32/48 favicons, 180×180 apple-touch-icon, 192×192 and 512×512 PWA icons, 512×512 maskable icon, 150×150 Windows tile, multi-resolution favicon.ico (16/32/48/64), Safari pinned-tab SVG, site.webmanifest, and browserconfig.xml.',
  },
  {
    platform: 'Desktop',
    icon: Monitor,
    color: '#0078D4',
    sizes: 'Windows tiles at 16, 24, 32, 48, 64, 128, 256 and 150; multi-resolution app.ico (16–256); macOS app.icns (16–1024); Linux hicolor PNGs at 16, 32, 48, 64, 128, 256, and 512.',
  },
];

const faqs = [
  {
    q: 'What file formats can I upload?',
    a: 'PNG, JPG, WebP, and SVG are accepted, up to 25 MB per file. Large bitmaps are downscaled to a 2048px long edge for consistent rendering and export. A square source of 1024×1024 or larger gives the best results.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Your artwork is read, rendered, edited, and exported entirely in your browser. Background removal runs locally with a bundled U2Net model, and ZIP files are created on-device. Only the app’s own pages, fonts, and model files are fetched from the host.',
  },
  {
    q: 'What platforms are supported?',
    a: 'Android (ldpi–xxxhdpi launcher and round icons, adaptive foreground/background, monochrome, notification, Play Store), iOS (19 AppIcon sizes plus Contents.json), Web/PWA (favicons, apple-touch-icon, manifest, maskable icon, ICO, browserconfig), and Desktop (Windows tiles + ICO, macOS ICNS, Linux PNGs).',
  },
  {
    q: 'Can I customize the background?',
    a: 'Yes. Choose a solid colour, one of nine linear-gradient presets, or a transparent background. Padding, fit mode, rotation, shape masks, adjustments, shadows, borders, and flips are also editable with live previews.',
  },
  {
    q: 'What export format is used?',
    a: 'Icons are rendered as high-quality PNGs. Platform-specific files include multi-resolution ICO and ICNS, favicon.ico, SVG, site.webmanifest, browserconfig.xml, and iOS Contents.json. Everything is packaged into one structured ZIP archive.',
  },
  {
    q: 'Can I remove an image background?',
    a: 'Yes. The Remove Background tool offers local U2Net AI removal for photos and complex artwork, plus a chroma-key tool for flat-colour logos. Both run in your browser and preserve the rest of your edits.',
  },
  {
    q: 'Does my work survive a page reload?',
    a: 'Yes. Your current artwork and edits are saved locally in IndexedDB, so reloading /editor restores the exact session. Uploading a new image replaces the saved artwork; Reset clears it.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'Current Chrome, Edge, Firefox, and Safari 15+ on desktop and mobile. The editor uses the Canvas API, WebAssembly for U2Net, and IndexedDB for local session storage. Internet Explorer is not supported.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes. CloudIcon Studio is free, requires no account, and has no export limits or watermarks. The only hard limit is the 25 MB upload cap per image.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. The editor runs in a normal browser tab. There is no install popup; if you want an app-like window, you can use your browser’s “Install” or “Add to Home Screen” menu option manually.',
  },
];

function StatsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/30 p-4 sm:p-5 text-center"
            >
              <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="size-4 sm:size-5 text-primary" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gradient">{s.value}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function UseCasesSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-40 size-80 rounded-full bg-accent-4/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 sm:text-sm">
            Who it&apos;s for
          </h2>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            Built for <span className="text-gradient">everyone</span> who ships apps
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-border/50 bg-card/30 p-4 sm:p-5 hover:bg-card/50 transition-all"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <uc.icon className="size-4 sm:size-5 text-primary" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">{uc.title}</p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function WhyChooseSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 sm:text-sm">
            Why CloudIcon Studio
          </h2>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            The <span className="text-gradient">smart choice</span> for app icons
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-xl border border-border/50 bg-card/30 p-4 sm:p-5 hover:bg-card/50 transition-all"
            >
              <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <item.icon className="size-4 sm:size-5 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-medium mb-1.5">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ExportDetailsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -right-40 size-80 rounded-full bg-accent-3/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 sm:text-sm">
            What you get
          </h2>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            Complete icon sets for <span className="text-gradient">every platform</span>
          </p>
        </motion.div>
        <div className="space-y-3 sm:space-y-4">
          {exportDetails.map((item, i) => (
            <motion.div
              key={item.platform}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-border/50 bg-card/20 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="size-4 sm:size-5" style={{ color: item.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-medium mb-1">{item.platform}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.sizes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 sm:text-sm">
            Got questions?
          </h2>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            Frequently asked questions
          </p>
        </motion.div>
        <div className="space-y-2 sm:space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-xl border border-border/50 bg-card/20 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 p-3 sm:p-4 text-left text-sm sm:text-base font-medium hover:bg-muted/30 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'size-3.5 sm:size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    openIndex === i && 'rotate-180'
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CTASection() {
  const scrollToUpload = () => {
    const el = document.getElementById('upload-area');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground sm:px-4 sm:py-1.5 sm:text-sm mb-4">
            <Sparkles className="size-3 text-primary" />
            Ready to get started?
          </div>
          <p className="text-xl sm:text-3xl font-bold tracking-tight mb-3">
            Generate your icon set in seconds
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            No sign-up required. No artwork uploaded. Just upload, adjust, and download
            a complete platform-ready icon pack.
          </p>
          <button
            onClick={scrollToUpload}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium transition-all',
              'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
            )}
          >
            Upload Your Artwork
            <ArrowRight className="size-4" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
      <StatsSection />
      <ShowcaseSection />
      <UseCasesSection />
      <WhyChooseSection />
      <ExportDetailsSection />
      <FAQSection />
      <CTASection />
    </PageLayout>
  );
}
