'use client';

import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/page-layout';
import { HeroSection } from '@/components/hero-section';
import {
  Smartphone, Apple, Globe, Monitor, Palette, Shapes, Zap, Crop, RotateCw,
  Download, Sparkles, Shield, Server, Users, Layers, CheckCircle, ChevronDown,
  Star, Code, Image, Package, ArrowRight, Grid, Lock, FileArchive, RefreshCw,
  Eye, Sliders, Grip, Ruler
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Layers, value: '7+', label: 'Platforms Supported' },
  { icon: Image, value: '50+', label: 'Icon Sizes Generated' },
  { icon: Server, value: '100%', label: 'Client-Side Processing' },
  { icon: Shield, value: 'Zero', label: 'Server Uploads' },
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
    title: 'Privacy First — Zero Server Uploads',
    desc: 'Your images never leave your device. All processing happens in your browser using the Canvas API. No servers, no storage, no data collection. Your artwork stays yours.',
  },
  {
    icon: Zap,
    title: 'Blazing Fast — Instant Export',
    desc: 'GPU-accelerated rendering powered by Fabric.js means your icons generate instantly. No waiting in queues, no processing delays. Upload, tweak, export in under a minute.',
  },
  {
    icon: Grid,
    title: 'Every Size, Every Format',
    desc: 'From Android mipmap mdpi to iOS App Store icons, from Web favicons to Desktop ICO files — we generate every required size and format. One upload, complete coverage.',
  },
  {
    icon: Package,
    title: 'Structured ZIP Exports',
    desc: 'Your icons are packaged in a logically organized ZIP archive with proper folder hierarchy for each platform. Ready to drop directly into your project.',
  },
  {
    icon: Eye,
    title: 'Real-Time Device Previews',
    desc: 'See exactly how your icon looks on actual device mockups before exporting. Toggle between Android, iOS, Web, and Desktop with live updates as you edit.',
  },
  {
    icon: Sliders,
    title: 'Full Editing Toolset',
    desc: 'Crop, rotate, adjust padding, change backgrounds, apply shape masks — all with instant visual feedback. The intuitive controls give you precision without complexity.',
  },
];

const exportDetails = [
  {
    platform: 'Android',
    icon: Smartphone,
    color: '#3DDC84',
    sizes: '48×48 (mdpi), 72×72 (hdpi), 96×96 (xhdpi), 144×144 (xxhdpi), 192×192 (xxxhdpi), adaptive icons (foreground + background), Play Store (512×512)',
  },
  {
    platform: 'iOS',
    icon: Apple,
    color: '#007AFF',
    sizes: '20×20 (Notification), 29×29 (Settings), 40×40 (Spotlight), 58×58 (Settings@2x), 60×60 (iPhone), 76×76 (iPad), 80×80 (Spotlight@2x), 87×87 (Settings@3x), 1024×1024 (App Store)',
  },
  {
    platform: 'Web',
    icon: Globe,
    color: '#4285F4',
    sizes: '16×16 (favicon), 32×32, 48×48, 64×64, 96×96, 128×128, 192×192 (PWA), 256×256, 512×512 (PWA), apple-touch-icon, mask-icon, browserconfig XML',
  },
  {
    platform: 'Desktop',
    icon: Monitor,
    color: '#0078D4',
    sizes: 'Windows: 16×16, 32×32, 48×48, 256×256 (ICO). macOS: 16×16, 32×32, 64×64, 128×128, 256×256, 512×512, 1024×1024 (ICNS). Linux: 48×48, 256×256 (PNG)',
  },
];

const faqs = [
  {
    q: 'What file formats can I upload?',
    a: 'You can upload PNG, JPG, WEBP, and SVG files. For best results, use a square source image at least 1024×1024px.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Everything runs entirely in your browser using Canvas API. Your image never leaves your device.',
  },
  {
    q: 'What platforms are supported?',
    a: 'Android (mipmap mdpi-xxxhdpi, adaptive icons, monochrome, Play Store), iOS (iPhone, iPad, App Store), Web (favicons, PWA), and Desktop (Windows, macOS, Linux).',
  },
  {
    q: 'Can I customize the background?',
    a: 'Yes. Solid colors, linear gradients, or transparent backgrounds are supported with a live preview.',
  },
  {
    q: 'What export format is used?',
    a: 'All icons are exported as PNG. The download is a structured ZIP archive with proper folder hierarchy for each platform.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes, completely free. There are no limits, no accounts, and no hidden charges.',
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
            No sign-up required. No files uploaded. Just upload, adjust, and download
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
      <UseCasesSection />
      <WhyChooseSection />
      <ExportDetailsSection />
      <FAQSection />
      <CTASection />
    </PageLayout>
  );
}
